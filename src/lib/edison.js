define(function(require) {

	var _ = require('underscore'),
		Section = require('./section'),
		Route = require('./route'),
		Router = require('./router');

	var Edison = function() {
		this.init.apply(this, _.toArray(arguments));
		return {
			'createSection': this.createSection.bind(this),
			'initRoutes': this.initRoutes.bind(this),
			'extendRoutes': this.extendRoutes.bind(this)
		};
	};

	_.extend(Edison.prototype, {

		'init': function(options) {
			options = options || {};
			_.defaults(options, this.options);
			this.options = options;
			if ( !options.route_container ) {
				throw 'A value must be specified for `route_container.`';
			} else {
				this.route_container = document.getElementById(options.route_container);
				if ( ! this.route_container ) {
					throw 'Specified route container does not exist: `' + options.route_container + '.`';
				}
			}
		},

		'options': {
			'route_container': null
		},

		'debug': true,

		'routes_initialized': false,

		'sections': {},

		'active_parent_section': null,

		'active_section': null,

		'active_section_intervals': [],

		'active_parent_section_intervals': [],

		'active_route': null,

		'Routes': null,

		'route_extensions': [],

		'log': function() {
			if ( !this.debug ) {
				return;
			}
			console.log(arguments);
		},

		'createSection': function(options) {
			options = options || {};
			_.defaults(options, {
				'name': null
			});
			this.sections[options.name] = new Section(options, this);
			return this.sections[options.name];
		},

		'checkParentSection': function(section_name) {
			if ( _.isString(this.sections[section_name].getParentSection()) ) {
				if ( this.active_parent_section !== this.sections[section_name].getParentSection() ) {
					if ( !_.empty(this.active_parent_section) ) {
						this.active_parent_section.cleanup();
						this.clearParentSectionIntervals();
					}
					this.active_parent_section = this.sections[section_name].getParentSection();
					var parentSection = this.sections[section_name].getParentSection();
					this.sections[parentSection].runCallback();
				}
			} else {
				this.active_parent_section = null;
				this.clearParentSectionIntervals();
			}
		},

		'clearParentSectionIntervals': function() {
			_.each(this.active_parent_section_intervals, function(interval_id) {
				clearInterval(interval_id);
			});
		},

		'initRoutes': function() {
			var self = this;
			this.log('Initializing routes...');
			if ( this.routes_initialized ) {
				return;
			}
			this.routes_initialized = true;
			this.router = new Router(this);
			this.router.bind('on_route', this.onRoute.bind(this));
			this.router.listen();
		},

		'onRoute': function(data) {
			this.log('onRoute', data);
			var self = this;
			if ( !this.sections[data.section_name] ) {
				return;
			}
			var section = this.sections[data.section_name],
				route;
			if ( !data.route_name ) {
				route = section.getDefaultRoute();
			} else {
				route = section.getRoute(data.route_name);
			}
			if ( !route ) {
				return;
			}

			_.each(self.active_section_intervals, function(interval_id) {
				clearInterval(interval_id);
			});

			var previousRoute = this.getActiveRoute();
			if ( previousRoute ) {
				previousRoute.cleanup();
			}

			var previousSection = this.getActiveSection();
			if ( previousSection ) {
				if ( previousSection.getName() !== data.section_name ) {
					previousSection.cleanup();
				}
			}

			this.checkParentSection(data.section_name);
			route.init(function(err) {
				if ( err ) {
					// todo - ?
				} else {
					route.initRoute(data.route_id);
				}
			});
		},

		'navigate': function(route, leave_history) {
			var opts = {
				trigger: true,
				replace : leave_history
			};
			this.Routes.navigate(route, opts);
		},

		'setActiveSection': function(section) {
			this.active_section = section;
		},

		'setActiveRoute': function(route) {
			this.active_route = route;
		},

		'getTemplate': function(tpl_id) {
			if ( _.empty(tpl_id) ) {
				return false;
			}
			var tpl_container = $("#rtpl_" + tpl_id);
			if ( $(tpl_container).size() !== 1 ) {
				return false;
			}
			var template = $(tpl_container).html();
			try {
				return Handlebars.compile(template);
			} catch(e) {
				return false;
			}
		},

		'getDebug': function() {
			return this.debug;
		},

		'getActiveSection': function() {
			return this.active_section;
		},

		'getActiveRoute': function() {
			return this.active_route;
		},

		'createSectionInterval': function(fn, interval) {
			this.active_section_intervals.push(setInterval(fn, interval));
		},

		'createParentSectionInterval': function(fn, interval) {
			this.active_parent_section_intervals.push(setInterval(fn, interval));
		},

		'getRoutes': function() {
			return this.Routes;
		},

		'insertTemplate': function(template) {
			$(this.route_container).html(template);
		},

		'extendRoutes': function(ext) {
			if ( !_.isObject(ext) ) {
				throw 'Invalid extension(s) specified: expected an object.';
			}
			this.route_extensions.push(ext);
		},

		'getRouteExtensions': function() {
			return this.route_extensions;
		}

	});

	return Edison;

});
