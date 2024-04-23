var ajax;
var dadosUsuario;

// ----- Cria o objeto e faz a requisi��o -----
function requisicaoHTTP(tipo,url,assinc){
	if(window.XMLHttpRequest){// Objeto usado no Mozila, Safari...
		ajax = new XMLHttpRequest;
	}
	else if(window.ActiveXObject){// Objeto usado pelo Internet Explorer
		ajax = new ActiveXObject("Msxml2.XMLHTTP");
		if(!ajax){
			ajax = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	//ajax � a vari�vel que vai armanezar o objeto que ser� utilizado baseado no navegador usado pelo usu�rio
	if (ajax){
		iniciaRequisicao(tipo,url,assinc); // Iniciou com sucesso
	}else{
		alert("Seu navegador n�o possui suporte a essa aplica��o"); // Mensagem que ser� exibida caso n�o seja poss�vel iniciar a requisi��o
	}
}
// ----- Inicia o objeto criado e envia os dados (se existirem) -----
function iniciaRequisicao(tipo, url, bool){
	ajax.onreadystatechange = trataResposta; //Atribui ao objeto a resposta da fun��o trataResposta
	ajax.open(tipo, url, bool); //Informa os par�metros do objeto: tipo de envio, url e se a comunica��o ser� ass�ncrona ou n�o
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");//Recupera as informa��es do cabe�alho
	ajax.send(dadosUsuario);// Envia os dados processados para o navegador
}
// ----- Inicia requisi��o com envio de dados -----
function enviaDados(url){
	criaQueryString(); //Chama a fun��o que transformar� os dados enviados em ua string
	requisicaoHTTP("POST", url, true); //Chama a fun��o que far� a requisi��o de dados ao servidor
}
// ----- Cria a string a ser enviada, formato campo1=valor&campo2=valor2... -----
function criaQueryString(){
	dadosUsuario = "";
	var frm = document.forms[0]; //Identifica o formul�rio
	var numElementos = frm.elements.length;// Informa o n�mero de elementos
	for(var i = 0; i < numElementos; i++){//Monta a querystring
		if(i < numElementos-1){ //Se i for menor que o n�mero de elementos (menos 1)
			dadosUsuario += frm.elements[i].name+"="+encodeURIComponent(frm.elements[i].value)+"&"; //recupera os valores que compor�o a url se houver mais elementos a serem inclu�dos;
		}
		else{
			dadosUsuario += frm.elements[i].name+"="+encodeURIComponent(frm.elements[i].value); //recupera os valores que compor�o a url se houver mais elementos a serem inclu�dos;
		}
	}
}
// ----- Trata a resposta do servidor -----
function trataResposta(){
	if(ajax.readyState == 4){// Se todas as informa��es e a conex�o foi fechada...
		if(ajax.status == 200){// Se o status da conex�o for 200
			trataDados(); // Chama a fun��o trataDAdos
		}
		else{
			alert("Problema na comunica��o com o objeto XMLHttpRequest.");
		}
	}
}


var dadosAtuais; //Array que guarda os dados atuais da linha antes de edit�-la
var linhaEmEdicao = null; //Guarda o ID da linha a ser editada, inclu�da ou exclu�da
var linhasNovas = 0; //Vari�vel auxiliar


//Exclui uma linha da tabela
function ExcluirLinha(idLinha, cod,tabela){
	if(!linhaEmEdicao){
		var linha = document.getElementById(idLinha);//Armazena o id da linha que ser� exclu�da
		linha.className = 'linhaSelecionada';// define a classe de estilos que ser� usada na linha
		Aviso(1); // Exibe o aviso: Aguarde...
		var url = "tarefa_view_2.php?acao=excluir&tabela="+tabela+"&cod="+cod;//Url que ser� enviada
		requisicaoHTTP("GET", url, true);//Fun��o que far� a requisi��o
	}else{
		alert("Voce esta com um registro aberto. Feche-o antes de prosseguir.");
	}
}

//Finalizar uma linha da tabela
function FinalizarTarefa(idLinha, cod,tabela,data_fim){
	if(!linhaEmEdicao){
		Aviso(1); // Exibe o aviso: Aguarde...
		var url = "tarefa_view_2.php?acao=atualizar&tabela="+tabela+"&id="+cod+"&data_fim="+data_fim;//Url que ser� enviada
		requisicaoHTTP("GET", url, true);//Fun��o que far� a requisi��o
	}else{
		alert("Faltam parametros necessarios para Finalizar a Tarefa !");
	}
}

//Reabre uma tarefa jah finalizada
function reabrirTarefa(cod,tabela){
	if(!linhaEmEdicao){
		Aviso(1); // Exibe o aviso: Aguarde...
		var url = "tarefa_view_2.php?acao=reabrirTarefa&tabela="+tabela+"&id="+cod;//Url que ser� enviada
		requisicaoHTTP("GET", url, true);//Fun��o que far� a requisi��o
	}else{
		alert("Faltam parametros necessarios para Finalizar a Tarefa !");
	}
}


//iniciar/finaliza tempo de dura��o da atividade
function ControlTimer(opt, id,nome){
	if(!linhaEmEdicao){
		Aviso(1); // Exibe o aviso: Aguarde...
		var url = "tarefa_view_2.php?acao=timer&opt="+opt+"&id="+id+"&nome="+nome;//Url que ser� enviada
		requisicaoHTTP("GET", url, true);//Fun��o que far� a requisi��o
	}else{
		alert("Faltam parametros necessarios para Finalizar a Tarefa !");
	}
}

//Atualiza o conte�do da linha
function Atualizar(c,u,s,e,a,di,df,o){
	Aviso(1); //Exibe o aviso aguarde...
	var dados = ObtemDadosForm(c,u,s,e,a,di,df,o);//Chama a fun��o que montar� a string com os dados que estar�o na url
	var cod = c;//Armazena o c�digo do produto que ser� atualizado
	var url = "tarefa_view_2.php?acao=atualizar"; //Monta a url
	url += "&cod="+cod+"&"+dados;//Monta a url
	requisicaoHTTP("GET", url, true);//Inicia a requisi��o
}

//Chamada do programa em PHP que cadastra no banco de dados
function Cadastrar(c,u,s,e,a,di,df,o){
	Aviso(1);//Chama a fun��o aviso
	var dados = ObtemDadosForm(c,u,s,e,a,di,df,o, 0); //Armazena a string com dados que compor�o a url
	var url = "tarefa_view_2.php?acao=cadastrar&"+dados;//Url que ser� enviada
	requisicaoHTTP("GET", url, true);//Inicia a requisi��o
}

//Coloca os dados do formul�rio em formato de query string
function ObtemDadosForm(c,u,s,e,a,di,df,o){
	parametros = "usuario="+u+"&setor="+s+"&empresa="+e+"&atividade="+a+"&data_ini="+di+"&data_fim="+df+"&obs="+o;//Define os par�metros da url que ser� enviada
	return parametros;//Retorna o valor da vari�vel como resposta da fun��o
}

//Exibe ou oculta a mensagem de espera
function Aviso(exibir){
	var saida = document.getElementById("avisos");//Armazena a chamada da div avisos
	if(exibir){// Se exibir for verdadeio...
		saida.className = "aviso";//Define que a classe a ser usada ser� avisos
		saida.innerHTML = "Aguarde... Processando!";// Exibe o aviso: Aguarde... Processando!
	}else{
		saida.className = "";//Elimina a classe se exibir for falso
		saida.innerHTML = "";//N�o exibe nenhum aviso
	}
}

//Trata a  resposta do servidor, de acordo com a opera��o realizada
function trataDados(){
	var resposta = ajax.responseText; //armazena a resposta do servidor

	if(resposta == 1){
		alert('Tarefa atualizada com Sucesso.');
		window.location.reload();
	}
	if(resposta == 2){
		alert('Linha excluida com Sucesso.');
		window.location.reload();
	}
	if(resposta == 3){
		alert('Tarefa cadastrada com Sucesso.');
		window.location.href="tarefa_view.php";
	}
	if(resposta == 4){
		alert('Tarefa Finalizada com Sucesso.');
		window.location.reload();
	}
	if(resposta == 5){
		alert('Tarefa Iniciada com Sucesso.');
		window.location.reload();
	}
	if(resposta == 6){
		alert('Falha na Inicializacao da Tarefa !');
		window.location.reload();
	}
	if(resposta == 7){
		alert('Tarefa Reinicada com Sucesso !');
		window.location.reload();
	}
	if(resposta == 8){
		alert('Tarefa Pausada com Sucesso !');
		window.location.reload();
	}
	Aviso(0);
}


/*
requisicaoHTTP = tenta  instanciar o objeto XMLHttpRequest e, se conseguir, chama a fun��o que far� a requisi��o, passando a ela os dados fornecidos pelo usu�rio.

iniciaRequisi��o = recebe os dados da fun��o requisi��oHTTP e processa a requisi��o, al�m de definir a fun��o que ir� tratar a resposta do servidor.

enviaDados = faz uma requisi��o definindo antes os dados a serem enviados, que, no caso, s�o obtidos de um formul�rio HTML. Caso n�o haja dados a seresm enviados, podemos chamar diretamente a fun��o requisicaoHTTP.

criaQueryString = coloca os dados do firmul�rio no formato de uma QueryString, para que o servidor possa identificar os pares nome/valor.

trataResposta = verifica se a requisi��o foi conlu�da e inicia o tratamento dos dados. H� diferen�a desta fun��o para a fun��o trataDados(), que voc� dever� criar em seu programa para realizar o tratamento desejado sobre os dados retornados pelo servidor.

Poss�veis valores do readyState
0(N�o Iniciado): O Objeto foi criado mas o m�todo open() n�o foi chamado ainda. 
1(Carregando): O m�todo open() foi chamado mas a requisi��o n�o foi enviada ainda. 
2(Carregado): A requisi��o foi enviada. 
3(Incompleto): Uma parte da resposta do servidor foi recebida. 
4(Completo): Todos as informa��es foram recebidas e a conex�o foi fechada com sucesso. 
*/