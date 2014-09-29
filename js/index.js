angular.module('sumulta', ['ngRoute', 'ngResource'])
	.factory('User', function($resource)
	{
		var User = $resource('/api/1/users/:name');
		return User;
	})
	.factory('Auth', function($resource)
	{
		var Auth = $resource('/api/1/auth');
		return Auth;
	})
	.factory('Project', function($resource)
	{
		var Project = $resource('/api/1/projects/:name');
		return Project;
	})
	.controller('HeadCtl', function($scope, User, Project, Auth)
	{
		$scope.users = User.query();
		$scope.projects = Project.query();
		$scope.auth = Auth.get();
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