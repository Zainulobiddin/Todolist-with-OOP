class Todolist {
  constructor(API) {
    this.API = API;
    this.get();
    this.box = document.querySelector(".box");
    this.addName = document.querySelector(".addName");
    this.addProfession = document.querySelector(".addProfession");
    this.addHobby = document.querySelector(".addHobby");
    this.addStatus = document.querySelector(".addStatus");
    this.add = document.querySelector(".add");
    this.idx = null;
    this.editModal = document.querySelector(".editModal");
    this.editForm = document.querySelector(".editForm");
    this.cancel = document.querySelector(".cancel");
    this.selectStatus = document.querySelector(".selectStatus");
    this.searchInput = document.querySelector(".searchInput");
    this.infoModal = document.querySelector(".infoModal");
    this.name_h2 = document.querySelector(".name_h2");
    this.profession_h4 = document.querySelector(".profession_h4");
    this.hobby_p = document.querySelector(".hobby_p");
    this.status_p = document.querySelector(".status_p");
    this.info = document.querySelector(".info");

    // Events
    this.add.onclick = () => {
      this.addUser();
    };
    this.cancel.onclick = () => {
      this.editModal.close();
    };
    this.info.onclick= ()=>{
        this.infoModal.close()
    }
    this.selectStatus.onchange = () => {
      this.funcSelectStatus(this.selectStatus.value);
    };
    this.editForm.onsubmit = async (event) => {
      event.preventDefault();
      let form = event.target;
      let newEdit = {
        name: form["editName"].value,
        profession: form["editProfession"].value,
        hobby: form["editHobby"].value,
        status: form["editStatus"].value == "true" ? true : false,
      };
      try {
        await fetch(`${this.API}/${this.idx}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEdit),
        });
        this.get();
      } catch (error) {
        console.error(error);
      }
    };
    this.searchInput.oninput = () => {
      this.funcSearch();
    };
  }

  async get() {
    let response = await fetch(this.API);
    let data = await response.json();
    this.getData(data);
  }

  // search
  async funcSearch() {
    try {
      let response = await fetch(`${this.API}?name=${this.searchInput.value}`);
      let data = await response.json();
      this.getData(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Select Status
  async funcSelectStatus(value) {
    if (value != "All") {
      try {
        let response = await fetch(`${this.API}?status=${value}`);
        let data = await response.json();
        this.getData(data);
        // vaqti all kardan kor namerunad
      } catch (error) {
        console.error(error);
      }
    } else {
      this.get();
    }
  }

  // add User
  async addUser() {
    let newADDUser = {
      name: this.addName.value,
      profession: this.addProfession.value,
      hobby: `My hobby id ${this.addHobby.value}`,
      id: Date.now(),
    };
    try {
      await fetch(this.API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newADDUser),
      });
    } catch (error) {
      console.error(error);
    }
  }

  // openEditModal
  openEditModal(elem) {
    this.editModal.showModal();
    this.editForm["editName"].value = elem.name;
    this.editForm["editProfession"].value = elem.profession;
    this.editForm["editHobby"].value = elem.hobby;
    this.editForm["editStatus"].value = elem.status ? "true" : "false";
    this.idx = elem.id;
  }

  // delete User
  async deleteUser(id) {
    try {
      await fetch(`${this.API}/${id}`, { method: "DELETE" });
      this.get();
    } catch (error) {
      console.error(error);
    }
  }

  // checkStatus
  async checkFunc(elem) {
    let checkStatus = {
      ...elem,
      status: !elem.status,
    };
    try {
      await fetch(`${this.API}/${elem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkStatus),
      });
      this.get();
    } catch (error) {
      console.error(error);
    }
  }

  // info mofal & func
  infoFunc(elem){
    this.infoModal.showModal()
    this.name_h2.innerHTML = elem.name
    this.profession_h4.innerHTML = elem.profession
    this.hobby_p.innerHTML = elem.hobby
    this.status_p.innerHTML = elem.status ? 'Active' : 'InActive'
  }

  getData(user) {
    this.box.innerHTML = "";
    user.forEach((element) => {
      let divUser = document.createElement("div");
      let name = document.createElement("h2");
      let profession = document.createElement("h4");
      let hobby = document.createElement("p");
      let status = document.createElement("p");
      let actions = document.createElement("div");
      let del = document.createElement("button");
      let edit = document.createElement("button");
      let info = document.createElement("button");
      let check = document.createElement("input");

      name.innerHTML = element.name;
      profession.innerHTML = element.profession;
      hobby.innerHTML = element.hobby;
      status.innerHTML = element.status ? "Active" : "InActive";
      if (element.status) {
        status.style.color = "green";
        status.style.fontWeight = "bold";
        status.style.fontSize = "18px";
      } else {
        name.style.textDecorationLine = "line-through";
      }
      del.innerHTML = "❌";
      del.onclick = () => {
        this.deleteUser(element.id);
      };
      edit.innerHTML = "🖊";
      edit.onclick = () => {
        this.openEditModal(element);
      };
      info.innerHTML = '👁‍🗨'
      info.onclick =()=>{
        this.infoFunc(element)
      }
      check.type = "checkbox";
      check.checked = element.status;
      check.onclick = () => {
        this.checkFunc(element);
      };
      actions.append(del, edit, info, check);
      actions.classList.add("actions");
      divUser.append(name, profession, hobby, status, actions);
      divUser.classList.add("divUser");
      this.box.append(divUser);
    });
  }
}

new Todolist("http://localhost:3000/data");



