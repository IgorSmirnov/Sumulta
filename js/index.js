'use strict';
var api = '/api/1/';
angular.module('sumulta', ['ngRoute', 'ngResource'])
	.factory('User', function($resource)
	{
		var User = $resource(api + 'users/:name');
		return User;
	})
	.factory('Project', function($resource)
	{
		var Project = $resource(api + 'projects/:name', null, {'update': { method:'PUT' }});
		return Project;
	})
	.factory('OwnedProject', function($resource)
	{
		var OwnedProject = $resource(api + 'users/:owner/projects/:name', null, {'update': { method:'PUT' }});
		return OwnedProject;
	})	

	.controller('Auth', function($scope, $rootScope, $http)
	{
		function set(n, r) {$rootScope.user = {auth: !!n, name: n || 'guest', rights: r || ''};}
		set();
		$scope.reg = false;
		$http.get(api + 'auth/')
 			.success(function(data, status, headers, config) 
 			{
 				for(var x in data) $scope.user[x] = data[x];
	  		});
	  	$scope.setAuth = function(auth)
	  	{
	  		$rootScope.auth = auth;
	  	}
		$scope.register = function(username, password)
		{
			$http.post(api + 'auth/register', {username: username, password:password})
				.success(function(data, status, headers, config) 
				{
					$scope.reg = false;
					set(username);
				});
		}	  		
		$scope.login = function(username, password)
		{
			$http.post(api + 'auth/login', {username: username, password:password})
				.success(function(data, status, headers, config) 
				{
					$rootScope.auth = false;
					set(username, data.rights);
				});
		}
		$scope.logout = function()
		{
			$http.post(api + 'auth/logout')
				.success(function(data, status, headers, config) {set();});
		}
		$scope.showReg = function()
		{
			$scope.reg = true;
		}
		$scope.hideReg = function()
		{
			$scope.reg = false;
		}		
	})
	.directive('compareTo', function() {
    	return {
        	require: 'ngModel',
            scope: {
            	otherModelValue: "=compareTo"
        	},
        	link: function(scope, element, attributes, ctl) 
        	{ 
            	ctl.$parsers.unshift(function(modelValue) 
            	{
            		ctl.$setValidity('compareTo', modelValue === scope.otherModelValue.$modelValue)
                	return modelValue;
            	});
            	/*scope.$watch("otherModelValue", function() 
            	{
                	ctl.$validate();
            	});*/
        	}
    	};
	})
	.controller('HeadCtl', function($scope, User, Project)
	{
		$scope.users = User.get();
		$scope.projects = Project.get();
		//$scope.auth = Auth;
	})
	.controller('ProjectCtl', function($scope, $route, $routeParams, $location) 
	{
    	$scope.$route = $route;
    	$scope.$location = $location;
    	$scope.$routeParams = $routeParams;
 	})
	.config(function($routeProvider, $locationProvider)
	{
		$locationProvider.html5Mode(true);
		$routeProvider
			.when('/',               {controller: 'HeadCtl', templateUrl: '/html/head.html'})
			.when('/:user',          {/*controller: 'HeadCtl',*/ templateUrl: '/html/user.html'})
			.when('/:user/:project', {controller: 'ProjectCtl', templateUrl: '/html/project.html'});
	});

/*function ($scope, $location, Project)
{
	$scope.save = function()
	{
		Project.save($scope.project, function(project)
		{
			//$location.path();
		})

	}

}*/