var saveButton = document.getElementById("saveButton");
    var deleteButton = document.getElementById("deleteButton");
    // var inputText = document.getElementById("inputText");
    var taskList = document.getElementById("taskList");
    var notice = document.getElementById("notice");
     const dueDate = document.getElementById("dueDate");
     const taskTitle = document.getElementById("taskTitle");
  const taskContent=document.getElementById("taskContent");
     const category = document.getElementById("category");
  const priority = document.getElementById("priority");
  const filterDueDateStart = document.getElementById("filterDueDateStart");
  const filterDueDateEnd = document.getElementById("filterDueDateEnd");
  const filterCategory = document.getElementById("filterCategory");
  const filterPriority = document.getElementById("filterPriority");
  const sortBy = document.getElementById("sortBy");
  const showBacklogs = document.getElementById("showBacklogs");
  var inputTags = document.getElementById("inputTags");
    var tasks = []; // Array of Objects to store tasks
    var count=0; // To store unique id for every note

    var activityLogButton = document.getElementById("activityLogButton");

  activityLogButton.addEventListener("click", function () {
    showActivityLog();
  });
  var homeButton = document.getElementById("homeButton");

  homeButton.addEventListener("click", function () {
    var act_log=document.getElementById("logss");
  // act_log.textContent=logText;
  act_log.style.display="none";
  var cont=document.getElementById("to_hide");
  cont.style.display="block";
  });

  
    // ... Your existing code ...
  
    // ... Your existing code ...
  
  
  function showActivityLog() {
    const activityLogs = getFromLocalStorage("activityLogs");
    let logText = "Activity Log:\n\n";
    if (activityLogs && activityLogs.length > 0) {
      activityLogs.forEach((log, index) => {
        logText += `${index + 1}. ${log}\n`;
      });
    } else {
      logText += "No activity logs yet.";
    }
  
    // Open a new window to display the activity log
  //   const logWindow = window.open("", "_blank");
  //   if (logWindow) {
  //     logWindow.document.write(`<pre>${logText}</pre>`);
  //   } else {
  //     alert("Unable to open activity log. Please check your browser settings.");
  //   }
  // 
  // console.log(logText);
  var act_log=document.getElementById("logss");
  act_log.textContent=logText;
  act_log.style.display="flex";
  var cont=document.getElementById("to_hide");
  cont.style.display="none";
  // document.getElementById("container").style.display="none";
  }
  
  function logActivity(activity) {
    const activityLogs = getFromLocalStorage("activityLogs") || [];
    activityLogs.push(activity+"  "+new Date().toLocaleString());
    saveToLocalStorage("activityLogs", activityLogs);
  }
  
  function getFromLocalStorage(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  
  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
   


    // ((IMPORTANT TO NOTE THAT TO GENERATE UNIQUE ID EVERY TIME WE USED A COUNTER))

    // Fetch notes from external API only when tasks array is mepty
    
    // ((IMPORTANT TO NOTE THAT NOTES WILL BE FFETCHED FROM API ONLY WHEN THE LOCAL STORAGE IS EMPTY))
    // function fetchNotes() {
    //   console.log(tasks.length);
    //   return fetch('https://jsonplaceholder.typicode.com/todos')
    //     .then(response => response.json())
    //     .then(data => {
    //       if(tasks.length!=0)
    //       {
    //         return;
    //       }
    //       else if (tasks.length==0 && Array.isArray(data)) {
    //         tasks = data.map(function(note) {
    //           return {
    //             text: note.title,
    //             id: note.id,
    //             // completed: note.completed
    //           };
    //         }
    //         );
    //         // renderTasks();
    //         count=tasks.length;
    //         saveNotes();
    //       }
         
    //        else {
    //         console.error('Invalid data format received from the API');
    //       }
    //     })
    //     .catch(error => {
    //       console.error('Error fetching notes:', error);
    //     });
        
    // }
    let draggedTask;

function dragStart(event) {
  draggedTask = event.target;
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const dropTarget = event.target;
  const taskList = document.getElementById("taskList");

  if (dropTarget.classList.contains("task-item")) {
    taskList.insertBefore(draggedTask, dropTarget); // Move the dragged task before the drop target
  } else if (dropTarget.classList.contains("task-container")) {
    taskList.appendChild(draggedTask); // Move the dragged task to the end of the container
  }

  // Reorder the tasks in the tasks array based on their new order in the task list
  const updatedTasks = [];
  taskList.querySelectorAll(".task-item").forEach((taskItem) => {
    const taskId = parseInt(taskItem.id.split("-")[1]);
    const task = tasks.find((t) => t.id === taskId);
    updatedTasks.push(task);
  });
  tasks = updatedTasks;

  saveNotes(); // Save the updated tasks order to Local Storage
}

    [filterDueDateStart, filterDueDateEnd, filterCategory, filterPriority].forEach((filter) => {
      filter.addEventListener("change", () => {
        renderTasks();
      });
    });

    sortBy.addEventListener("change", () => {
      renderTasks();
    });

    showBacklogs.addEventListener("change", () => {
      renderTasks();
    });

    // Save notes to Local Storage and count as well for unique id
    function saveNotes() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("count",JSON.stringify(count));
    }

    // Fetch notes and render tasks when the page loads
    window.addEventListener('load', function() {
      var storedNotes = localStorage.getItem("tasks");
      var storedCount = localStorage.getItem("count");
      if (storedNotes) {
        tasks = JSON.parse(storedNotes);
        count = JSON.parse(storedCount);
      }
      // fetchNotes().then(fetchLocalNotes);
      fetchLocalNotes();
    });


    function applyFilters() {
      const filterDueDateStart = document.getElementById("filterDueDateStart").value;
      const filterDueDateEnd = document.getElementById("filterDueDateEnd").value;
      const filterCategory = document.getElementById("filterCategory").value;
      const filterPriority = document.getElementById("filterPriority").value;
      const showBacklogs = document.getElementById("showBacklogs").checked;
      
      //   return (showBacklogs && !task.done && dueDate < currentDate);
    
      const filteredTasks = tasks.filter((task) => {
        // Check if the task matches the selected filters
        const dueDateMatch = !filterDueDateStart || !filterDueDateEnd || (
          task.dueDate >= filterDueDateStart && task.dueDate <= filterDueDateEnd
        );
        const categoryMatch = !filterCategory || task.category === filterCategory;
        const priorityMatch = !filterPriority || task.priority === filterPriority;

        const dueDate = new Date(task.dueDate);
      const currentDate=new Date();
        const blmatch = !showBacklogs || (showBacklogs && !task.done && dueDate < currentDate);

        return blmatch && dueDateMatch && categoryMatch && priorityMatch;
      });
    
      return filteredTasks;
    }

    saveButton.addEventListener("click", () => {
      const title = taskTitle.value.trim();
      const content=taskContent.value.trim();
      let date="";
      if(dueDate.value!=""){
      date = dueDate.value;
      }
      else{
        date = parseDueDateFromText(content);
      }
      var tags = inputTags.value.trim();
      // const date= dueDate.value;
      const cat = category.value;
      const prio = priority.value;

      

      if (title !== "" && content != "") {
        const newTask = {
          title: title,
          dueDate: date,
          category: cat,
          content: content,
          priority: prio,
          done: false,
          id: ++count,
          tags: tags.split(",").map(tag => tag.trim()),
          subtasks: [],
        };

        tasks.push(newTask);
        logActivity(`Added task: ${title}`);
        // console.log(`Added task: ${newTask}`);
        renderTasks();
        saveNotes();
        taskTitle.value = "";
        taskContent.value="";
        dueDate.value = "";
        inputTags.value = ""; 
        category.value = "personal";
        priority.value = "low";
       
      }
    });

    function deleteTask(taskId) {
      var task = tasks.find(function(task) {
        return task.id === taskId;
      });
      logActivity(`Deleted task: ${task.title}`);
      tasks = tasks.filter(function(task) {
        return task.id !== taskId;
      });

      renderTasks();
      saveNotes(); 
    }

    // function editTask(taskId) {
    //   var task = tasks.find(function(task) {
    //     return task.id === taskId;
    //   });

    //   if (task) {
    //     var taskItem = document.getElementById("task-" + taskId);
    //     var taskTextElem = taskItem.querySelector(".task-text");
    //     var inputElem = document.createElement("input");
    //     inputElem.type = "text";
    //     inputElem.value = task.text;
    //     inputElem.style.width="100%";

    //     taskTextElem.replaceWith(inputElem);
    //     inputElem.focus();

    //     var editbut=document.getElementById("But-" + taskId);
    //     var newbutele =document.createElement("button");
    //     newbutele.textContent="Save";
    //     newbutele.classList.add("btn");
    //     editbut.replaceWith(newbutele);

       


    //     newbutele.addEventListener("click", function(event) {
         
    //         task.text = inputElem.value.trim();
    //         renderTasks();
    //         saveNotes();
    //       }
    //     );
    //     inputElem.addEventListener("keydown", function(event) {
    //       if (event.key === "Enter") { 
            
    //         newbutele.click();
    //       }
    //     });

        
        

       
    //   }
    // }

    function showEditForm(task) {
      // Create a form element
      const form = document.createElement("form");
    
      // Create input fields for editing task attributes
      const titleInput = createInputField("text", "title", "Task Title", task.title);
      const dueDateInput = createInputField("date", "dueDate", "Due Date", task.dueDate);
      const categoryInput = createInputField("text", "category", "Category", task.category);
      const priorityInput = createInputField("text", "priority", "Priority (low, medium, high)", task.priority);
      const contentInput = createInputField("text", "content", "Task Content", task.content);
      // Create a submit button
      const submitButton = document.createElement("button");
      submitButton.type = "button";
      submitButton.textContent = "Save";
      submitButton.classList.add("btn");
      submitButton.addEventListener("click", function() {
        editTask(task.id, form); // Call the editTask() function when the submit button is clicked
      });
    
      // Add input fields and submit button to the form
      form.appendChild(titleInput);
      form.appendChild(contentInput);
      form.appendChild(dueDateInput);
      form.appendChild(categoryInput);
      form.appendChild(priorityInput);
      form.appendChild(submitButton);
    
      // Clear the taskList and append the form to display it
      taskList.innerHTML = "";
      taskList.appendChild(form);
    }
    function createInputField(type, name, placeholder, value) {
      const input = document.createElement("input");
      input.type = type;
      input.name = name;
      input.placeholder = placeholder;
      input.value = value;
      input.classList.add("form-input");
      return input;
    }
    function editTask(taskId, form) {
      const task = tasks.find((task) => task.id === taskId);
    
      // Update the task object with the edited values from the form input fields
      task.title = form.title.value;
      task.dueDate = form.dueDate.value;
      task.category = form.category.value;
      task.priority = form.priority.value;
      task.content = form.content.value;
    
      saveNotes(); // Save the updated tasks to Local Storage
    
      // Recreate the task item with the updated details
      const taskItem = document.createElement("div");
      // ... Existing code to create the taskItem ...
      // You can reuse the same code that you used in the renderTasks() function to create the taskItem
    
      // Replace the form with the updated task item in the task list
      taskItem.classList.add("task-item");
      taskItem.id = "task-" + task.id;
      taskItem.draggable="true";
      taskItem.addEventListener("dragstart", dragStart);
      taskItem.addEventListener("dragover", dragOver);
      taskItem.addEventListener("drop", drop);

      if (task.priority === "high") {
        taskItem.classList.add("high-priority");
        // Create and append the reminder text
        const reminderText = document.createElement("div");
        reminderText.textContent = "Important";
        reminderText.classList.add("reminder");
        taskItem.appendChild(reminderText);

        setTimeout(() => {
          taskItem.removeChild(reminderText);
        }, 5000);
      }
      if(task.subtasks){
      // Create a div to display subtasks
const subtaskList = document.createElement("div");
subtaskList.classList.add("subtask-list");

// Loop through the subtasks and add them to the subtaskList
task.subtasks.forEach(function (subtask) {
  const subtaskItem = document.createElement("div");
  subtaskItem.classList.add("subtask-item");

  const subtaskTextElem = document.createElement("div");
  subtaskTextElem.textContent = subtask.title;
  subtaskTextElem.classList.add("subtask-text");

  const subtaskCheckbox = document.createElement("input");
  subtaskCheckbox.type = "checkbox";
  subtaskCheckbox.checked = subtask.done;
  subtaskCheckbox.addEventListener("change", () => {
    subtask.done = subtaskCheckbox.checked;
    saveNotes();
    renderTasks();
  });

  subtaskItem.appendChild(subtaskCheckbox);
  subtaskItem.appendChild(subtaskTextElem);
  subtaskList.appendChild(subtaskItem);
});
taskItem.appendChild(subtaskList);
}

//   const addSubtaskButton = document.getElementById("addSubtaskButton");
// const subtaskTitleInput = document.getElementById("subtaskTitleInput");
var subTaskInput = document.createElement("input");
subTaskInput.type="text";
subTaskInput.placeholder="Enter subtask";
var addSubtaskButton = document.createElement("button");
addSubtaskButton.classList.add("subTask-button", "btn");
// editButton.id = "But-" + task.id;
addSubtaskButton.textContent = "Add SubTask";

addSubtaskButton.addEventListener("click", function() {

const subtaskTitle = subTaskInput.value.trim();

if (subtaskTitle !== "") {
addSubtask(task.id, subtaskTitle);
subTaskInput.value = ""; // Clear the input field after adding the subtask
}
});

      if (task.tags && task.tags.length > 0) {
        const tagsContainer = document.createElement("div");
        tagsContainer.classList.add("tags");
        task.tags.forEach(tag => {
          const tagElem = document.createElement("span");
          tagElem.textContent = tag;
          tagsContainer.appendChild(tagElem);
        });
        taskItem.appendChild(tagsContainer);
      }

      var taskTextElem = document.createElement("div");
      taskTextElem.classList.add("task-text");
      taskTextElem.textContent = task.id + ". " + `${task.title} - Due: ${task.dueDate} - Category: ${task.category} - Priority: ${task.priority} \n ${task.content}`;

      // var editButton = document.createElement("button");
      // editButton.classList.add("edit-button", "btn");
      // editButton.id = "But-" + task.id;
      // editButton.textContent = "Edit";
      // editButton.addEventListener("click", function() {
      //   editTask(task.id);
      // });

      const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.classList.add("edit-button", "btn");
editButton.addEventListener("click", function() {
  showEditForm(task); // Call the showEditForm() function when the button is clicked
});

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        renderTasks();
        saveNotes();
      });

      var deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button", "btn");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function() {
        deleteTask(task.id);
      });

      

      taskItem.appendChild(taskTextElem);

      taskItem.appendChild(editButton);
      taskItem.appendChild(checkbox);
     
      taskItem.appendChild(subTaskInput);
      taskItem.appendChild(addSubtaskButton);
      taskItem.appendChild(deleteButton);
      form.replaceWith(taskItem);
    
      // Re-render the tasks to update the UI
      renderTasks();
    }
            
    function parseDueDateFromText(text) {
      // Match the text for date patterns like "tomorrow" or "13th Jan 2023 3 pm"
      // const dateRegex = /(?:tomorrow|(\d{1,2}(?:th|st|nd)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}(?:\s+\d{1,2}:\d{2}\s+(?:am|pm))?)|(?:\d{1,2}:\d{2}\s+(?:am|pm)))/i;
      // const match = text.match(dateRegex);
    
      // if (match && match[0]) {
      //   // Parse the matched date and return it as the due date
      //   console.log(match[0]);
      //   const parsedDate = new Date(match[0]);
      //   return parsedDate.toISOString();
      // }
    
      // // Return null if no date is found in the text
      // return "";
      // console.log(text);
      // const dueDatePattern = /(today|by|due|on|before|at)(\s+)(\d{1,2}(st|nd|rd|th)?(\s+\w+)?(\s+\d{4})?(\s+\d{1,2}:\d{2}(\s+AM|PM)?)?)/i;
      const dueDatePattern = /(?:tomorrow|today|yesterday|Tomorrow|Today|Yesterday(\d{1,2}(?:th|st|nd)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}(?:\s+\d{1,2}:\d{2}\s+(?:am|pm))?)|(?:\d{1,2}:\d{2}\s+(?:am|pm)))/i;
      const dueDateMatch = text.match(dueDatePattern);
      console.log(dueDateMatch);
      if (dueDateMatch) {
        // Extract the due date text from the input
        const dueDateText = dueDateMatch[0];
        const d=new Date();
       
        if (dueDateText.toLowerCase().includes("tomorrow")) {
          return ` ${d.getFullYear()}-0${d.getMonth()+1}-${d.getDate()+1}`;
        } else if (dueDateText.toLowerCase().includes("today")) {
          return ` ${d.getFullYear()}-0${d.getMonth()+1}-${d.getDate()}`;
        } else if(dueDateText.toLowerCase().includes("yesterday")){
          // If none of the keywords found, use the original due date text as is
          return ` ${d.getFullYear()}-0${d.getMonth()+1}-${d.getDate()-1}`;
        } else{
          return dueDateText;
        }
      }
      else{
        return "";
      }
    }
    
    

    function priorityToNumber(priority) {
      switch (priority) {
        case "low":
          return 3;
        case "medium":
          return 2;
        case "high":
          return 1;
        default:
          return 0;
      }
    }
//     // Call this function after rendering tasks
// function setupReminders() {
//   setInterval(updateHighPriorityTasks, 10000); // Check every second (adjust as needed)
// }

// function updateHighPriorityTasks() {
//   const currentDate = new Date();
//   const highPriorityTasks = tasks.filter((task) => task.priority === "high");

//   highPriorityTasks.forEach((task) => {
//     const dueDate = new Date(task.dueDate);
//     if (dueDate < currentDate) {
//       // Add the "Important" reminder for overdue high-priority tasks
//       const taskItem = document.getElementById("task-" + task.id);
//       if (taskItem) {
//         const reminderText = document.createElement("div");
//         reminderText.textContent = "Important";
//         reminderText.classList.add("reminder");
//         taskItem.appendChild(reminderText);

//         setTimeout(() => {
//           taskItem.removeChild(reminderText);
//         }, 5000);
//       }
//     }
//   });
// }

//     setupReminders(); 


function generateUniqueId() {
  // Function to generate a unique ID using the current timestamp
  return Date.now().toString(36);
}

function addSubtask(taskId, subtaskTitle) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    const subtask = {
      id: generateUniqueId(), // You need to implement a function to generate unique IDs
      title: subtaskTitle,
      done: false
    };
    task.subtasks.push(subtask);
    saveNotes(); // Save the updated tasks to Local Storage
    renderTasks(); // Re-render the tasks to update the UI
  }
}

    function renderTasks() {
      taskList.innerHTML = "";
      // let filteredTasks = tasks.filter((task) => {
      //   const dueDate = new Date(task.dueDate);
      //   return (showBacklogs && !task.done && dueDate < currentDate);
      // });
      //  filteredTasks = applyFilters();
      const filteredTasks = applyFilters();
      const sortBy = document.getElementById("sortBy").value;
  switch (sortBy) {
    case "dueDate":
      filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case "priority":
      filteredTasks.sort((a, b) => priorityToNumber(a.priority) - priorityToNumber(b.priority));
      break;
    // Add more cases for other sorting criteria as needed
    default:
      break;
  }
      if (Array.isArray(filteredTasks)) {
        filteredTasks.forEach(function(task) {
          const taskItem = document.createElement("div");
          // taskItem.textContent = `${task.title} - Due: ${task.dueDate} - Category: ${task.category} - Priority: ${task.priority}`;

          // var taskItem = document.createElement("div");
          taskItem.classList.add("task-item");
          taskItem.id = "task-" + task.id;
          taskItem.draggable="true";
          taskItem.addEventListener("dragstart", dragStart);
          taskItem.addEventListener("dragover", dragOver);
          taskItem.addEventListener("drop", drop);

          if (task.priority === "high") {
            taskItem.classList.add("high-priority");
            // Create and append the reminder text
            const reminderText = document.createElement("div");
            reminderText.textContent = "Important";
            reminderText.classList.add("reminder");
            taskItem.appendChild(reminderText);

            setTimeout(() => {
              taskItem.removeChild(reminderText);
            }, 5000);
          }
          if(task.subtasks){
          // Create a div to display subtasks
    const subtaskList = document.createElement("div");
    subtaskList.classList.add("subtask-list");

    // Loop through the subtasks and add them to the subtaskList
    task.subtasks.forEach(function (subtask) {
      const subtaskItem = document.createElement("div");
      subtaskItem.classList.add("subtask-item");

      const subtaskTextElem = document.createElement("div");
      subtaskTextElem.textContent = subtask.title;
      subtaskTextElem.classList.add("subtask-text");

      const subtaskCheckbox = document.createElement("input");
      subtaskCheckbox.type = "checkbox";
      subtaskCheckbox.checked = subtask.done;
      subtaskCheckbox.addEventListener("change", () => {
        subtask.done = subtaskCheckbox.checked;
        saveNotes();
        renderTasks();
      });

      subtaskItem.appendChild(subtaskCheckbox);
      subtaskItem.appendChild(subtaskTextElem);
      subtaskList.appendChild(subtaskItem);
    });
    taskItem.appendChild(subtaskList);
  }

//   const addSubtaskButton = document.getElementById("addSubtaskButton");
// const subtaskTitleInput = document.getElementById("subtaskTitleInput");
var subTaskInput = document.createElement("input");
subTaskInput.type="text";
subTaskInput.placeholder="Enter subtask";
var addSubtaskButton = document.createElement("button");
addSubtaskButton.classList.add("subTask-button", "btn");
// editButton.id = "But-" + task.id;
addSubtaskButton.textContent = "Add SubTask";

addSubtaskButton.addEventListener("click", function() {
  
  const subtaskTitle = subTaskInput.value.trim();

  if (subtaskTitle !== "") {
    addSubtask(task.id, subtaskTitle);
    subTaskInput.value = ""; // Clear the input field after adding the subtask
  }
});

          if (task.tags && task.tags.length > 0) {
            const tagsContainer = document.createElement("div");
            tagsContainer.classList.add("tags");
            task.tags.forEach(tag => {
              const tagElem = document.createElement("span");
              tagElem.textContent = tag;
              tagsContainer.appendChild(tagElem);
            });
            taskItem.appendChild(tagsContainer);
          }

          var taskTextElem = document.createElement("div");
          taskTextElem.classList.add("task-text");
          taskTextElem.textContent = task.id + ". " + `${task.title} - Due: ${task.dueDate} - Category: ${task.category} - Priority: ${task.priority} \n ${task.content}`;

          // var editButton = document.createElement("button");
          // editButton.classList.add("edit-button", "btn");
          // editButton.id = "But-" + task.id;
          // editButton.textContent = "Edit";
          // editButton.addEventListener("click", function() {
          //   editTask(task.id);
          // });

          const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button", "btn");
    editButton.addEventListener("click", function() {
      showEditForm(task); // Call the showEditForm() function when the button is clicked
    });

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = task.done;
          checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            renderTasks();
            saveNotes();
          });

          var deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-button", "btn");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
          });

          

          taskItem.appendChild(taskTextElem);

          taskItem.appendChild(editButton);
          taskItem.appendChild(checkbox);
         
          taskItem.appendChild(subTaskInput);
          taskItem.appendChild(addSubtaskButton);
          taskItem.appendChild(deleteButton);
          taskList.appendChild(taskItem);
        });
      } else {
        console.error('Tasks array is invalid');
      }
    }

    deleteButton.addEventListener("click", function() {
      tasks = [];
      count=0;
      renderTasks();
      saveNotes(); 
    });

    // taskTitle.addEventListener("keyup", function(event) {
    //   if (event.key === "Enter") { 
    //     saveButton.click(); 
    //   }
    // });
    taskContent.addEventListener("keyup", function(event) {
      if (event.key === "Enter") { 
        saveButton.click(); 
      }
    });

    function fetchLocalNotes() {
      var storedNotes = localStorage.getItem("tasks");
      if (storedNotes) {
        tasks = JSON.parse(storedNotes);
        renderTasks();
      }
    }