const todoList = document.getElementById('todo_list');
const todoForm = document.getElementById('todo_form');
todoArr = [];

/* 
    displayTodos 함수는 todoArr 배열의 요소들을 화면에 새로 출력해준다. 
    리스트를 모두 지웠다가, todoArr에 있는 요소들을 모두
    다시 화면에 출력해준다.
    각 요소들에 대해 말풍선과 x버튼이 있기 때문에,
    forEach 함수 내에 addeventlistener가 들어가게 됨!
*/
function displayTodos(){
    todoList.innerHTML = "";
    todoArr.forEach(function(task){
        const todoItem = document.createElement('li');
        const todoDelBtn = document.createElement('span');
        todoItem.textContent = task.text;
        todoItem.title = '클릭 시 완료';
        todoDelBtn.textContent = 'x';
        todoDelBtn.title = '클릭 시 삭제';
        // done의 T/F 여부에 따라 class를 추가해준다.
        // 이는 css에서의 색깔 배분을 위한 작업!
        todoItem.classList.add(task.done ? 'done' : 'yet');
        // Item에 붙어있는 버튼을 먼저 append해준다
        todoItem.appendChild(todoDelBtn);
        // 매개변수를 받기 위해 따로 써주는듯? 삭제 버튼
        todoDelBtn.addEventListener('click', function(){
            handleTodoDelBtnClick(task.todoID)
        });
        // 말풍선 클릭 시
        todoItem.addEventListener('click', function(){
            handleTodoItemClick(task.todoID)
        });
        // 아이템에 대한 설정이 모두 끝나면 그것을 todoList에 append해준다
        todoList.appendChild(todoItem);
    })
}

/* 
    삭제버튼을 클릭했을 때 호출될 함수인 handleTodoDelBtnClick 함수이다.
    이 함수에서 filter 메소드를 통해 주어진 아이디의 요소를 삭제하고
    이를 반영하기 위해 display와 save를 다시 호출해준다.
*/
function handleTodoDelBtnClick(clickedId){
    // filter를 통해 해당 id의 요소를 걸러낸다
    // clickedId와 같지 않은 것이 true로 나와서 arr에 저장되고,
    // 같은 것들은 false로 나와 todoArr에서 자동적으로 삭제된다.
    todoArr = todoArr.filter(function(task){
        return task.todoID !== clickedId
    });
    // todoArr가 변경되었으므로, 다시 display를 해준다.
    displayTodos();
    // 변경된 점을 다시 로컬 스토리지에 저장해준다.
    saveTodos();
}

/*
    특정 할일 말풍선을 클릭했을 때 호출될 함수인 handleTodoItemClick 함수이다.
    이 함수에서 map 메소드를 이용하여 주어진 아이디의 요소에 대해서만
    변화를 주게 된다.
    이 역시 변화를 반영하기 위해 display와 save를 다시 호출해준다.
*/
function handleTodoItemClick(clickedId){
    todoArr = todoArr.map(function(task){
        if (task.todoID === clickedId){
        task.done = !task.done;
        }
        return task;
    })
    displayTodos();
    saveTodos();
}

/*
    로컬 스토리지에 내용을 저장하는 saveTodos 함수이다.
    여기서 주의할 점은, 자바스크립트에서는 배열을 사용할 수 있지만
    로컬 스토리지에는 문자열만 저장할 수 있다는 점이다.
    그러므로, 배열을 JSON 포맷의 문자열로 변경해주어야 한다.
*/
function saveTodos(){
    const todoString = JSON.stringify(todoArr);
    localStorage.setItem('myTodos', todoString);
}

/*
    로컬 스토리지에 저장되어 있는 내용을 불러오는 loadTodos 함수이다.
    saveTodos 함수에서와 마찬가지로, 
    이 내용은 JSON 포맷의 문자열 형태로 저장되어 있기 때문에
    이를 자바스크립트로 다시 가져오려면 다시 parse해주어야 한다.
    그리고, 이를 화면에 반영하기 위해 display를 다시 해주어야 한다.
*/
function loadTodos(){
    const myTodos = localStorage.getItem('myTodos');
    todoArr = (myTodos === null)? todoArr : JSON.parse(myTodos);
    displayTodos();
}

/* 
    할일을 입력하고 제출하면 발생할 이벤트 핸들링이다.
    입력한 할일 그자체, 식별자(여기서는 추가 날짜), done 여부를 설정해주고
    이를 array에 반영해준다.
    또한, array가 바뀌었으므로 다시 display를 해주어야 한다.
*/
todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    const toBeAdded = {
        // text: 입력한 그대로
        text: todoForm.todo.value,
        // todoID: 식별자로, 여기서는 그것을 추가한 날짜와 시간을 아이디로 했음
        todoID: new Date().getTime(),
        // done: 완료인지 미완료인지 체크하는 변수
        done: false
    };
    // 입력창을 비워주는 역할인듯.
    todoForm.todo.value = "";
    // 배열에 해당 요소 추가해주기
    todoArr.push(toBeAdded);
    // 바뀐 요소를 화면에 반영
    displayTodos();
    saveTodos();
})

// 시작할 때 한 번 호출되는 load 함수
loadTodos();