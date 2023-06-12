var pacientesCadastrados = [];
var consultasAgendadas = [];


function carregarDadosArmazenados() {
  var pacientesArmazenados = localStorage.getItem("pacientesCadastrados");
  if (pacientesArmazenados) {
    pacientesCadastrados = JSON.parse(pacientesArmazenados);
  }

  var consultasArmazenadas = localStorage.getItem("consultasAgendadas");
  if (consultasArmazenadas) {
    consultasAgendadas = JSON.parse(consultasArmazenadas);
  }
}

function salvarDadosArmazenados() {
  localStorage.setItem("pacientesCadastrados", JSON.stringify(pacientesCadastrados));
  localStorage.setItem("consultasAgendadas", JSON.stringify(consultasAgendadas));
}

function limparConteudo() {
  var conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "";
}


function exibirCadastroPaciente() {
  limparConteudo();

  var form = document.createElement("form");

  var nomeLabel = document.createElement("label");
  nomeLabel.innerHTML = "Nome do paciente:";
  form.appendChild(nomeLabel);

  var nomeInput = document.createElement("input");
  nomeInput.setAttribute("type", "text");
  form.appendChild(nomeInput);

  var telefoneLabel = document.createElement("label");
  telefoneLabel.innerHTML = "Telefone do paciente:";
  form.appendChild(telefoneLabel);

  var telefoneInput = document.createElement("input");
  telefoneInput.setAttribute("type", "text");
  form.appendChild(telefoneInput);

  var cadastrarButton = document.createElement("button");
  cadastrarButton.innerHTML = "Cadastrar";
  form.appendChild(cadastrarButton);

  form.onsubmit = function (event) {
    event.preventDefault();

    var nome = nomeInput.value;
    var telefone = telefoneInput.value;

    if (nome && telefone) {
      if (!pacienteJaCadastrado(telefone)) {
        cadastrarPaciente(nome, telefone);
        alert("Paciente cadastrado com sucesso!");
      } else {
        alert("Paciente já cadastrado!");
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }

    nomeInput.value = "";
    telefoneInput.value = "";
  };

  document.getElementById("conteudo").appendChild(form);
}

function pacienteJaCadastrado(telefone) {
  for (var i = 0; i < pacientesCadastrados.length; i++) {
    if (pacientesCadastrados[i].telefone === telefone) {
      return true;
    }
  }
  return false;
}

function cadastrarPaciente(nome, telefone) {
  var paciente = {
    nome: nome,
    telefone: telefone
  };
  pacientesCadastrados.push(paciente);
}

function exibirListaPacientes() {
  limparConteudo();

  var lista = document.createElement("ul");

  for (var i = 0; i < pacientesCadastrados.length; i++) {
    var paciente = pacientesCadastrados[i];
    var item = document.createElement("li");
    item.innerHTML = "Paciente: " + paciente.nome + "<br>" + "Telefone: " + paciente.telefone;
    lista.appendChild(item);
  }

  document.getElementById("conteudo").appendChild(lista);
}

function exibirMarcaConsulta() {
  limparConteudo();

  var form = document.createElement("form");

  var pacientesLabel = document.createElement("label");
  pacientesLabel.innerHTML = "Selecione o paciente:";
  form.appendChild(pacientesLabel);

  var pacientesSelect = document.createElement("select");
  for (var i = 0; i < pacientesCadastrados.length; i++) {
    var pacienteOption = document.createElement("option");
    pacienteOption.value = pacientesCadastrados[i].telefone;
    pacienteOption.innerHTML = pacientesCadastrados[i].nome;
    pacientesSelect.appendChild(pacienteOption);
  }
  form.appendChild(pacientesSelect);

  var diaLabel = document.createElement("label");
  diaLabel.innerHTML = "Dia da consulta:";
  form.appendChild(diaLabel);

  var diaInput = document.createElement("input");
  diaInput.setAttribute("type", "date");
  form.appendChild(diaInput);

  var horaLabel = document.createElement("label");
  horaLabel.innerHTML = "Hora da consulta:";
  form.appendChild(horaLabel);

  var horaInput = document.createElement("input");
  horaInput.setAttribute("type", "time");
  form.appendChild(horaInput);

  var especialidadeLabel = document.createElement("label");
  especialidadeLabel.innerHTML = "Especialidade:";
  form.appendChild(especialidadeLabel);

  var especialidadeInput = document.createElement("input");
  especialidadeInput.setAttribute("type", "text");
  form.appendChild(especialidadeInput);

  var agendarButton = document.createElement("button");
  agendarButton.innerHTML = "Agendar";
  form.appendChild(agendarButton);

  form.onsubmit = function (event) {
    event.preventDefault();

    var telefone = pacientesSelect.value;
    var dia = diaInput.value;
    var hora = horaInput.value;
    var especialidade = especialidadeInput.value;

    if (telefone && dia && hora && especialidade) {
      var currentDate = new Date();
      var selectedDate = new Date(dia);

      if (selectedDate >= currentDate) {
        if (!consultaJaAgendada(dia, hora)) {
          agendarConsulta(telefone, dia, hora, especialidade);
          alert("Consulta agendada com sucesso!");
        } else {
          alert("Já existe uma consulta agendada para essa data e horário.");
        }
      } else {
        alert("Não é possível agendar uma consulta retroativa.");
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }

    diaInput.value = "";
    horaInput.value = "";
    especialidadeInput.value = "";
  };

  document.getElementById("conteudo").appendChild(form);
}


function consultaJaAgendada(dia, hora) {
  for (var i = 0; i < consultasAgendadas.length; i++) {
    if (consultasAgendadas[i].dia === dia && consultasAgendadas[i].hora === hora) {
      return true;
    }
  }
  return false;
}

function agendarConsulta(telefone, dia, hora, especialidade) {
  var paciente = encontrarPaciente(telefone);

  if (paciente) {
    var consulta = {
      paciente: paciente,
      dia: dia,
      hora: hora,
      especialidade: especialidade
    };
    consultasAgendadas.push(consulta);
  }
}

function encontrarPaciente(telefone) {
  for (var i = 0; i < pacientesCadastrados.length; i++) {
    if (pacientesCadastrados[i].telefone === telefone) {
      return pacientesCadastrados[i];
    }
  }
  return null;
}

function exibirCancelaConsulta() {
  limparConteudo();

  var lista = document.createElement("ul");

  for (var i = 0; i < consultasAgendadas.length; i++) {
    var consulta = consultasAgendadas[i];
    var item = document.createElement("li");

    var card = document.createElement("div");
    card.className = "card";

    var pacienteInfo = document.createElement("div");
    pacienteInfo.innerHTML =
      "Paciente: " +
      consulta.paciente.nome +
      "<br>" +
      "Data: " +
      consulta.dia +
      "<br>" +
      "Hora: " +
      consulta.hora +
      "<br>" +
      "Especialidade: " +
      consulta.especialidade;

    var cancelarButton = document.createElement("button");
    cancelarButton.className = "btnCC";
    cancelarButton.innerHTML = "Cancelar";
    cancelarButton.setAttribute("data-consulta-index", i);
    cancelarButton.onclick = function () {
      var consultaIndex = parseInt(this.getAttribute("data-consulta-index"));
      cancelarConsulta(consultaIndex);
    };

    card.appendChild(pacienteInfo);
    card.appendChild(cancelarButton);
    item.appendChild(card);
    lista.appendChild(item);
  }

  document.getElementById("conteudo").appendChild(lista);
}


function cancelarConsulta(consultaIndex) {
  consultasAgendadas.splice(consultaIndex, 1);
  alert("Consulta cancelada com sucesso");
  exibirCancelaConsulta();
}

document.getElementById("cadastroPaciente").onclick = function () {
  exibirCadastroPaciente();
};

document.getElementById("listaPacientes").onclick = function () {
  exibirListaPacientes();
};

document.getElementById("marcaConsulta").onclick = function () {
  exibirMarcaConsulta();
};

document.getElementById("cancelaConsulta").onclick = function () {
  exibirCancelaConsulta();
};

document.getElementById("sair").onclick = function () {
  window.location.href = "default.html";
};

function voltarPaginaInicial() {
  window.location.href = "index.html";
}

window.onload = function () {
  carregarDadosArmazenados();
};

window.onbeforeunload = function () {
  salvarDadosArmazenados();
};