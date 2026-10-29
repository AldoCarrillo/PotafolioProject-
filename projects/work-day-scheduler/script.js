//function set the time in the webpage
function setTime(){
    var currentDate_div = $("#currentDay");
    var date = moment().format("dddd, MMMM Do YYYY, h:mm a");
    currentDate_div.text(date);

}


//main functions creates all html alements to be used
function displayList(){
    var container = $(".container");
    var current_Hour = moment().format("H");


    for (let index = 6; index < 24; index++) {

        var list_div = document.createElement("div");
        list_div.setAttribute("style","display:flex;");


        var input_Element = document.createElement("input");
        input_Element.setAttribute("placeholder","Add task");
        var newid = "input" + (index-6);
        input_Element.setAttribute("id",newid);

        var label_Element = document.createElement("p");
        label_Element.setAttribute("id","pLabel");

        var button_Element = document.createElement("button");
        button_Element.setAttribute("id",index-6);
        button_Element.setAttribute("class","save-button");

        var delete_Element = document.createElement("button");
        delete_Element.setAttribute("id",index-6);
        delete_Element.setAttribute("class","delete-button");

        if(index < current_Hour) {
            input_Element.setAttribute("style","background-color: hsl(0, 100%, 90%);");
            label_Element.setAttribute("style","background-color: hsl(0, 100%, 90%);");
            input_Element.setAttribute("placeholder","Expired");
            input_Element.setAttribute("disabled","");

        }

        if(index == current_Hour){
            input_Element.setAttribute("style","background-color: #82E0AA;");
            label_Element.setAttribute("style","background-color: #82E0AA;");
        }


        if(index <=12)
            label_Element.textContent = index + ":00 am";
        else
            label_Element.textContent = index + ":00 pm";

        button_Element.textContent = "Save"
        delete_Element.textContent = "Delete"


        list_div.append(label_Element);
        list_div.append(input_Element);
        list_div.append(button_Element);
        list_div.append(delete_Element);

        container.append(list_div);

    }

    loadStoraged();

}

//get the local storaged and fill the inputtexts with all array values
function loadStoraged(){

    if(JSON.parse(localStorage.getItem("tasks"))){
        var storedTasks = JSON.parse(localStorage.getItem("tasks"));
        console.log(storedTasks);

        for (let index = 0; index < storedTasks.length; index++)
            $(("#input"+index)).val(storedTasks[index]);

    }

    else
        console.log("not storaged");


}


// set the local storage the value of the input text
function setStoraged(taskid,input_id,tasktosave){


    if(JSON.parse(localStorage.getItem("tasks")))
        var tasks = JSON.parse(localStorage.getItem("tasks"));
    else
        var tasks = [18];


    tasks[taskid]= tasktosave;
    localStorage.setItem("tasks", JSON.stringify(tasks));

}


//clear the task depends the button was clicked
function clearTasks(input_id,taskid){

    $(input_id).val("");

    var tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[taskid]= null;

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

//Functions RUNS at the beggining
// set the time formated
setTime();
//displays all the elements and load locarstorage
displayList();

//listener of the button when is clicked
$(".save-button").click(function(event){
    var input_id = "#input"+this.id;
    var tasktosave = $(input_id).val();

    setStoraged(this.id,input_id,tasktosave);

    if($(input_id).val()=="")
        clearTasks(input_id,this.id);

    loadStoraged();

});


//delete button deletes the task of the array and clears the input text
$(".delete-button").click(function(event){
    var input_id = "#input"+this.id;
    clearTasks(input_id,this.id);
    loadStoraged();
});
