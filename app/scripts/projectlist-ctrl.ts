module app {
  interface IProjectListScope extends angular.IScope {
    projects: string[]
    newProject : (projectId:string) => void
  }

  export class ProjectListController {

    constructor($scope: IProjectListScope,
                $state : angular.ui.IStateService,$localStorage : IProjectStorage) {
        if (!$localStorage.projects) $localStorage.projects = {}
        $scope.projects = []
        for (let project in $localStorage.projects) $scope.projects.push(project);
        $scope.newProject = (projectId:string) => { $state.go('project',{projectId:projectId})}
    }
  }
}
