import index from './components/index'
import ProjectDetail from './components/ProjectDetail'
import ProjectList from './components/ProjectList'
import MyProject from './components/MyProject'
import Launch from './components/Launch'
import RequestWithdrawal from './components/RequestWithdrawal'

export default [
  {path: '/', component: index},
  {path: '/ProjectDetail', component: ProjectDetail},
  {path: '/ProjectList', component: ProjectList},
  {path: '/MyProject', component: MyProject},
  {path: '/Launch', component: Launch},
  {path: '/RequestWithdrawal', component: RequestWithdrawal},

]
