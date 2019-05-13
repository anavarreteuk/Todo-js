var app = (function() {
  var addButtonElement = document.getElementById("addButton");
  var itemDescriptionElement = document.getElementById("ItemDescription");
  var toDoListElement = document.getElementById("toDoList");
  var titleContainer = document.getElementById("titleContainer");
  var totalCounter = 0;
  let completedCounter = 0;

  var item = (function() {
    var id = 0;
    return function(title, completed) {
      this.id = id++;
      this.title = title;
      this.completed = completed;
    };
  })();

  var toDoList = (function() {
    var itemsList = [];

    return {
      loadItems: function() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            itemsList = JSON.parse(this.responseText);
            itemsList.sort((a, b) => b.id - a.id);
            toDoList.addTotalCounter(itemsList);
            toDoList.refreshCounter();
            toDoList.addCompletedCounter(itemsList);
            toDoList.refreshCompletedCounter();

            itemsList.forEach(function(element) {
              toDoList.addItem(element.title, element.completed);
            });
          }
        };
        xhttp.open("GET", "/api/todos", true);
        xhttp.send();
      },

      addTotalCounter: function(element) {
        element.forEach(item => totalCounter++);
      },

      refreshCounter: function() {
        var counterElement = document.createElement("h4"); // is a node
        counterElement.innerHTML = `Total number of Todos : ${totalCounter}`;
        titleContainer.appendChild(counterElement);
      },

      addCompletedCounter: function(element) {
        element
          .filter(item => item.completed === true)
          .forEach(item => completedCounter++);
      },

      refreshCompletedCounter: function() {
        var counterElement = document.createElement("h4"); // is a node
        counterElement.innerHTML = `Total number of Completed Todos : ${completedCounter}`;
        titleContainer.appendChild(counterElement);
      },

      addItem: function(title, completed) {
        //Create new item and add to the model
        var newItem = new item(title, completed);
        //Add to the view
        var itemElement = createItemElement(
          newItem.id,
          newItem.title,
          completed
        );
        toDoListElement.appendChild(itemElement);
        //Clear the text-box
        itemDescriptionElement.value = "";
      },

      removeItem: function(id) {
        var itemSelected = document.getElementById("item" + id);
        //Remove from the model
        itemsList.forEach(function(element, index) {
          if (element.id == id) {
            itemsList.splice(index, 1);
          }
        });
        //Remove from the view

        totalCounter = totalCounter - 1;
        titleContainer.removeChild(titleContainer.childNodes[3]);
        titleContainer.removeChild(titleContainer.childNodes[3]);

        toDoList.refreshCounter();
        toDoList.refreshCompletedCounter();
        toDoListElement.removeChild(itemSelected);
      }
    };
  })();

  //Create the HTML structure for the items
  function createItemElement(id, description, completed) {
    //<li id="item#">
    var itemElement = document.createElement("li");
    itemElement.setAttribute("id", "item" + id);

    //<div class="div-description">
    var itemDescriptioncontainerElement = document.createElement("div");
    itemDescriptioncontainerElement.setAttribute("class", "description");

    //<span id="descriptiontext#"> Text </span></div>
    var descriptionText = document.createElement("span");
    descriptionText.setAttribute("id", "descriptionText" + id);
    descriptionText.appendChild(document.createTextNode(description));
    itemDescriptioncontainerElement.appendChild(descriptionText);
    itemElement.appendChild(itemDescriptioncontainerElement);

    //<div class="div-actions">
    var actionscontainerElement = document.createElement("div");
    actionscontainerElement.setAttribute("class", "actions");

    if (completed) {
      descriptionText.setAttribute("class", "item-selected");
    }

    //<li><div>class="delete-button"></div></li>
    var deleteButtonElement = document.createElement("button");
    deleteButtonElement.appendChild(document.createTextNode("DEL"));
    deleteButtonElement.setAttribute("class", "delete-button");
    deleteButtonElement.addEventListener("click", function(e) {
      toDoList.removeItem(id);
    });
    actionscontainerElement.appendChild(deleteButtonElement);
    itemElement.appendChild(actionscontainerElement);
    return itemElement;
  }

  toDoList.loadItems();

  function sendDescriptionValue() {
    if (itemDescriptionElement.value.length) {
      toDoList.addItem(itemDescriptionElement.value, false);
    }
  }

  //Add event to Enter key up
  itemDescriptionElement.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
      sendDescriptionValue();
      totalCounter += 1;
      titleContainer.removeChild(titleContainer.childNodes[3]);
      titleContainer.removeChild(titleContainer.childNodes[3]);

      toDoList.refreshCounter();
      toDoList.refreshCompletedCounter();
    }
  });

  //Add function for onclick event
  addButtonElement.onclick = function() {
    sendDescriptionValue();
    totalCounter += 1;
    titleContainer.removeChild(titleContainer.childNodes[3]);
    titleContainer.removeChild(titleContainer.childNodes[3]);

    toDoList.refreshCounter();
    toDoList.refreshCompletedCounter();
  };
})();
