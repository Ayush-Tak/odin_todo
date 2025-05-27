import * as appLogic from  "./modules/appLogic.js";
import * as ui from "./modules/ui.js";

document.addEventListener('DOMContentLoaded',()=>{
    console.log("DOM fully loaded");
//     if (appLogic.getProjects().length > 0 && appLogic.getProjects()[0].getTodos().length === 0) {
//       appLogic.addTodoToCurrentProject('Welcome Todo', 'Get started with the app!', 'today', 'normal');
//   }

    ui.renderAll();
    ui.initializeUIEventListeners();

    console.log("App rendered");
    console.log("Current project is : ", appLogic.getCurrentProject().name);
    console.log("All projects: ",appLogic.getProjects().map(p=>p.name))
})