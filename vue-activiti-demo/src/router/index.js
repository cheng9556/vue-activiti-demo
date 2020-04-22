import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Modeler from '@/edit-modeler/components/Modeler'
import Viewer from '@/edit-modeler/components/Viewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Modeler',
      component: Modeler
    },
    {
      path: '/edit-modeler/modeler',
      name: 'Modeler',
      component: Modeler

    },
    {
      path: '/edit-modeler/viewer',
      name: 'Viewer',
      component: Viewer

    }
  ]
})
