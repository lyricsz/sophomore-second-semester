const container = document.getElementById("container");

let currentGPA = 0.0;
let allUnit = 0.0;

class Course{
    constructor(){
        this.elementContainer = document.createElement("tr");
        this.elementContainer.name = "courseContainer";
        this.gScore = 0;
    }
    appendAll(){
        container.appendChild(this.elementContainer);
    }
    appendSubject(subject){
        const sbj = document.createElement("th");
        sbj.innerHTML = subject;
        this.elementContainer.appendChild(sbj);
    }
    appendGrade(grade){
        const grd = document.createElement("td");
        grd.name = "grade"
        grd.textContent = grade;
        grade = grade.toUpperCase();
        if (grade == "A"){
            this.gScore = 5;
        } else if (grade == "B"){
            this.gScore = 4;
        } else if (grade == "C"){
            this.gScore = 3;
        } else if (grade == "D"){
            this.gScore = 2;
        } else if (grade == "E"){
            this.gScore = 1;
        } else if (grade == "F"){
            this.gScore = 0;
        } else {
            this.gScore = null;
        }
        grd.accessKey = this.gScore;
        this.elementContainer.appendChild(grd);
    }
    appendUnit(unit){
        const unt = document.createElement("td");
        unt.name = "unit";
        unt.textContent = unit + '\n';
        this.elementContainer.appendChild(unt);
    }
}

function generate(){
    const courseI = prompt("Enter a course: ", "CSC201");
    const gradeI = prompt("Enter a grade: ", "A");
    const unitI = prompt("Enter course unit: ", "4");
    createCourse(courseI, gradeI, unitI);
}

addBtn.onclick = () => {
    generate();
}

removeBtn.onclick = () => {
    removeCourse();
}

function removeCourse() {
    if (container.children.length <= 1){
        return
    }
    if (confirm("Did you want to remove the last course? Press cancel to remove by course code")){
        container.removeChild(container.lastChild);
    } else if(confirm("Did you want to remove a course by it's code?")){
        const courseTitle = prompt("Enter the course title: ");
        document.querySelectorAll("tr").forEach(outerEl => {
            outerEl.childNodes.forEach(innerEl => {
                if (innerEl.nodeName == "TH" && innerEl.textContent.toLowerCase() == courseTitle.toLowerCase()) {
                    container.removeChild(outerEl);
                }
            });          
        })
    }
}

function animate(){
    document.querySelectorAll("tr").forEach(el => {
        let gradeScore = 0;
        let unit = 0;

        elements = el.childNodes;
        elements.forEach(el => {
            if (el.name == "grade"){
                gradeScore = el.accessKey;
            } else if (el.name == "unit") {
                unit = Number(el.textContent);
                allUnit += unit;
                currentGPA += (gradeScore * unit);
            }
        }); 
    });
    
    currentGPA = currentGPA / allUnit;
    currentGPA = currentGPA.toPrecision(3);

    if (container.children.length <= 1){
        currentGPA = "...Add a course"
    }

    document.getElementById("result").textContent = currentGPA;

    allUnit = 0;
    currentGPA = 0;

    requestAnimationFrame(animate);
}

animate();

document.querySelector("#saveBtn").onclick = () => {

    const trElements = [];

    document.querySelectorAll("tr").forEach((el, index) => {
        if (index == 0) {
            return;
        }
        let trChild = [];
        el.childNodes.forEach((el) => {
            trChild.push(el.textContent);
        });
        trElements.push(trChild);
    });

    window.localStorage.setItem("courseSave", trElements);
}

document.querySelector("#loadBtn").onclick = () => {
    let el = window.localStorage.getItem("courseSave");

    const nodeText = [];
    const elArray = [];

    for (i of [0]){
        let a = el.slice(0, el.lastIndexOf(",\n"))
        el = el.slice(el.indexOf(",\n") + 1, el.length);
        elArray.push(a);
    }

    elArray[0] = elArray[0].split(",");
    
    elArray.forEach((el) => {
        el[el.length - 1] = el[el.length - 1] + "\n";

        let tempArr = [];
        el.forEach((iEl) => {
            tempArr.push(iEl);
            if (iEl.indexOf("\n") > 0 || el.length < 3){
                nodeText.push(tempArr);
                tempArr = [];
            }
        });
    });

    if(nodeText.length > 1){
        document.querySelectorAll("tr").forEach((tr, index) => {
            if (tr.name == "courseContainer")
                container.removeChild(tr);
        });    
    }

    nodeText.forEach(node => {
        
        const text = [];
            node.forEach((el, index) => {
                text[index] = el;
        });
        createCourse(text[0], text[1], text[2]);
       
    });
}

function createCourse(courseI, gradeI, unitI){
    const subject = new Course();
    subject.appendSubject(courseI);
    subject.appendGrade(gradeI);
    subject.appendUnit(unitI);
    subject.appendAll();
}