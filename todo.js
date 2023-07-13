var saveButton = document.getElementById("saveButton");
    var deleteButton = document.getElementById("deleteButton");
    var inputText = document.getElementById("inputText");
    var taskList = document.getElementById("taskList");
    var notice = document.getElementById("notice");
    var tasks = []; // Array of Objects to store tasks
    var count=0; // To store unique id
    // Fetch notes from external API only when tasks array is mepty
    function fetchNotes() {
      console.log(tasks.length);
      return fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(data => {
          if(tasks.length!=0)
          {
            return;
          }
          else if (tasks.length==0 && Array.isArray(data)) {
            tasks = data.map(function(note) {
              return {
                text: note.title,
                id: note.id,
                // completed: note.completed
              };
            }
            );
            // renderTasks();
            count=tasks.length;
            saveNotes();
          }
         
           else {
            console.error('Invalid data format received from the API');
          }
        })
        .catch(error => {
          console.error('Error fetching notes:', error);
        });
        
    }

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
      fetchNotes().then(fetchLocalNotes);
     
    });

    saveButton.addEventListener("click", function() {
      var taskText = inputText.value.trim();
      if (taskText !== "") {
        var task = {
          text: taskText,
          id: ++count,
          // completed: false
        };
        tasks.push(task);

        renderTasks();
        saveNotes(); 

        inputText.value = "";
        notice.style.display = "block";
        notice.textContent = "Task saved: " + task.text;
      }
    });

    function deleteTask(taskId) {
      tasks = tasks.filter(function(task) {
        return task.id !== taskId;
      });

      renderTasks();
      saveNotes(); 
    }

    function editTask(taskId) {
      var task = tasks.find(function(task) {
        return task.id === taskId;
      });

      if (task) {
        var taskItem = document.getElementById("task-" + taskId);
        var taskTextElem = taskItem.querySelector(".task-text");
        var inputElem = document.createElement("input");
        inputElem.type = "text";
        inputElem.value = task.text;

        taskTextElem.replaceWith(inputElem);
        inputElem.focus();

        var editbut=document.getElementById("But-" + taskId);
        var newbutele =document.createElement("button");
        newbutele.textContent="Save";
        newbutele.classList.add("btn");
        editbut.replaceWith(newbutele);

       


        newbutele.addEventListener("click", function(event) {
         
            task.text = inputElem.value.trim();
            renderTasks();
            saveNotes();
          }
        );
        inputElem.addEventListener("keydown", function(event) {
          if (event.key === "Enter") { 
            
            newbutele.click();
          }
        });

        
        

       
      }
    }

    function renderTasks() {
      taskList.innerHTML = "";
      if (Array.isArray(tasks)) {
        tasks.forEach(function(task) {
          var taskItem = document.createElement("div");
          taskItem.classList.add("task-item");
          taskItem.id = "task-" + task.id;

          var taskTextElem = document.createElement("span");
          taskTextElem.classList.add("task-text");
          taskTextElem.textContent = task.id + ". " + task.text;

          var editButton = document.createElement("button");
          editButton.classList.add("edit-button", "btn");
          editButton.id = "But-" + task.id;
          editButton.textContent = "Edit";
          editButton.addEventListener("click", function() {
            editTask(task.id);
          });

          var deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-button", "btn");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
          });

          taskItem.appendChild(taskTextElem);
          taskItem.appendChild(editButton);
          taskItem.appendChild(deleteButton);
          taskList.appendChild(taskItem);
        });
      } else {
        console.error('Tasks array is invalid');
      }
    }

    deleteButton.addEventListener("click", function() {
      tasks = [];
      renderTasks();
      saveNotes(); 
    });

    inputText.addEventListener("keyup", function(event) {
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