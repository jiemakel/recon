namespace fi.seco.recon {
  'use strict'

  interface IProjectListScope extends angular.IScope {
    projects: ProjectInfo[]
    newProject: (projectId: string) => void
    maybeDeleteAll: () => void
  }

  class ProjectInfo {
    constructor(
    public name: string,
    public total: number,
    public counts: {
      match: number
      nomatch: number
    }) {}
  }

  export class ProjectListController {

    constructor($scope: IProjectListScope,
                $state: angular.ui.IStateService,
                $localStorage: IProjectStorage,
                $uibModal: angular.ui.bootstrap.IModalService) {
        if (!$localStorage.projects) $localStorage.projects = {}
        $scope.projects = []
        for (let project in $localStorage.projects)
          $scope.projects.push(new ProjectInfo(project, $localStorage.projects[project].state.data.length, $localStorage.projects[project].state.counts))
        $scope.newProject = (projectId: string) => { $state.go('project', {projectId: projectId})}
        $scope.maybeDeleteAll = () => {
          let modal: angular.ui.bootstrap.IModalServiceInstance = $uibModal.open({
            templateUrl: 'deleteAll',
          })
          modal.result.then(() => {
            $localStorage.projects = {}
            $scope.projects = []
          })
        }
    }
  }
}
