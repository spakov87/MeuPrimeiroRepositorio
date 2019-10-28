var id;

var dataSet = [];

var user = {
    id: null,
    name: null,
    age: null,
    cpf: null,
    address: null,
    number: null,
}

$("#btnLimpar").click(function () {
    limpar();
})

function salvar() {
    user.id = id;
    user.name = $("#txtNome").val();
    user.age = $("#txtIdade").val();
    user.cpf = $("#txtCpf").val();
    user.address = $("#txtEndereco").val();
    user.number = $("#txtNumero").val();

    if (user.name == "" || user.name == null) {
        $("#modalAlert").modal("show");
        $("#lblModalAlert").text("Por favor preencha o campo nome");
    }

    else if (user.cpf == "" || user.cpf == null) {
        $("#modalAlert").modal("show");
        $("#lblModalAlert").text("Por favor preencha o campo CPF");
    }

    else if (user.address == "" || user.address == null) {
        $("#modalAlert").modal("show");
        $("#lblModalAlert").text("Por favor preencha o campo Endereço");
    }

    else if (user.number == "" || user.number == null) {
        $("#modalAlert").modal("show");
        $("#lblModalAlert").text("Por favor preencha o campo Numero");
    }

    else {
        if (user.age == "" || user.age == null) {
            $("#modalAlert").modal("show");
            $("#lblModalAlert").text("Por favor preencha o campo idade");
        }
        else {
            $('#modalLoading').modal(
                {
                    backdrop: 'static',
                    keyboard: false
                }
            );

            var pageLength = $("#tbUsuarios_length option:selected").val();

            if (id == null) {

                $.ajax({
                    type: "POST",
                    url: "/user/create",
                    data: user,
                    dataType: "json",
                    before: function () {
                        //exibir um gif
                    },
                    success: function (id) {
                        console.log("Salvo com sucesso. Id numero " + id);
                        limpar();
                        //var arrayAux = [id, user.name, user.age, user.cpf, user.endereco, user.numero];
                        //var listaComNovoUsuario = dataSet.slice();

                        //listaComNovoUsuario.push(arrayAux);

                        //populateTable(listaComNovoUsuario, false, pageLength);
                        $("#modalAlert").modal("show");
                        $("#lblModalAlert").text("O usuário " + user.name + " foi adicionado com sucesso!");
                        listarUsuarios(true, 5);
                    },
                    error: function (erro) {
                        $("#lblModalAlert").text(erro.responseJSON.Message);
                        $("#modalAlert").modal("show");
                    },

                    complete: function () {
                        $('#modalLoading').modal("hide");
                    },
                })
            }
            else {
                $.ajax({
                    url: '/user/edit',
                    type: "PUT",
                    dataType: "json",
                    data: user,
                    success: function (retorno) {
                        limpar();
                        if (retorno) {
                            //console.log("O usuario " + user.name + " id: " + user.id + " foi alterado com sucesso!");
                            $("#modalAlert").modal("show");
                            $("#lblModalAlert").text("O usuário " + user.name + " foi alterado com sucesso!");

                            var listaComNovoUsuario = dataSet.slice();

                            $.each(listaComNovoUsuario, function (key, obj) {
                                if (user.id == obj[0]) {
                                    obj[1] = user.name;
                                    obj[2] = user.age;
                                    obj[3] = user.cpf;
                                    obj[4] = user.address;
                                    obj[5] = user.number;
                                    return                                    
                                }
                            })

                            populateTable(listaComNovoUsuario, false, pageLength);
                            
                        }
                        else {
                        }
                    },
                    error: function (erro) {
                        $("#lblModalAlert").text(erro.responseJSON.Message);
                        $("#modalAlert").modal("show");
                    },
                    complete: function () {
                        $('#modalLoading').modal("hide");
                    }
                });
            }
        }
    }
}

$("#btnSalvar").click(function () {
    salvar();
})

function selecionarUsuario(idEdit, nome, idade, cpf, address, number) {
    id = idEdit;
    $("#txtNome").val(nome)
    $("#txtIdade").val(idade)
    $("#txtCpf").val(cpf)
    $("#txtEndereco").val(address)
    $("#txtNumero").val(number)

}

function limpar() {
    $("#txtNome").val("");
    $("#txtIdade").val("");
    $("#txtCpf").val("");
    $("#txtEndereco").val("");
    $("#txtNumero").val("");
    id = null;
}

function confirmarDeletar(idDeletar, nome) {
    id = idDeletar;
    $("#lblModalPergunta").html("Deseja realmente deletar o usuário <h3>" + nome + "</h3>")
    $("#modalPergunta").modal("show");
}

$("#btnModalPerguntaSim").click(function (id) {
    deletar(id);
})

$("#btnModalPerguntaNao").click(function () {
    id = null;
})

function deletar() {

    $("#modalPergunta").modal("hide");

    $('#modalLoading').modal(
        {
            backdrop: 'static',
            keyboard: false
        }
    );

    var pageLength = $("#tbUsuarios_length option:selected").val();

    $.ajax({
        type: "DELETE",
        url: "/user/delete/" + id,
        before: function () {
            //exibir um gif
        },
        success: function () {
            $("#modalAlert").modal("show");
            $("#lblModalAlert").text("O usuário foi removido com sucesso!");

            listarUsuarios(true, -1)
           
        },
        sucess: function sucess() {
            console.log("Deletado com sucesso");
        },
        error: function () {
            funcaoDeErro();
        },
        complete: function () {
            $('#modalLoading').modal("hide");

            limpar();
        },
    })
}

function listarUsuarios(formatArray, pageLength) {
    $.ajax(
        {
            type: "GET",
            url: "/user/ListarUsuarios/",
            before: function () {
                $('#modalLoading').modal("show");
            },
            success: function (retorno) {
                populateTable(retorno, formatArray, pageLength);
            },
            error: function () {
                funcaoDeErro();
            },
            complete: function () {
                $('#modalLoading').modal("hide");
            },
        }
    )
}

listarUsuarios(true, -1);

function populateTable(listaDeUsuarios, formatArray, pageLength) {

    dataSet = [];

    if (formatArray === true) {
        $.each(listaDeUsuarios, function (key, obj) {
            var arrayAux = [
                obj.id,
                obj.name,
                obj.age,
                obj.cpf,
                obj.address,
                obj.number
            ];
            dataSet.push(arrayAux);
        })
    }
    else {
        dataSet = listaDeUsuarios;
    }

    $(document).ready(
        function () {
            $('#tbUsuarios').DataTable(
                {
                    destroy: true,
                    pageLength: pageLength,
                    lengthMenu: [[5, 10, -1], [5, 10, "Todos"]],
                    data: dataSet,
                    order: [[1, 'asc']],
                    columns: [
                        { title: "Id" },
                        { title: "Nome" },
                        { title: "Idade" },
                        { title: "CPF" },
                        { title: "Endereço" },
                        { title: "Numero" },
                        {
                            title: "Editar",
                            sorting: false,
                            render: function (data, type, row, meta) {


                                //return '<image onclick="selecionarUsuario(' + row[0] + ',\'' + row[1] + '\', ' + row[2] + ', \'' + row[3] + '\' )" title="editar" style="cursor: pointer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAb1BMVEX///89aIlz0PQ4ZYcxYYTS2uHs7/JAa4tmhJ3o7O9ef5pFbY14kqgtX4MhWH511Pk5YIFkq8xmsdJKeppNg6RIdZVouNu3xM+Oo7VbmblsvuCarb1vxOetvMlfn77Z4ObEzteCmq4ATXdUd5RUj7CLSUbIAAAFGUlEQVRoge3bbWOqIBgG4AxEzbC2tuVmHbX2/3/jqXhREIkHsE/jYyuvA88daHBWqwVb2uRlUub9sVhSMbdjiTFKkgRhijfda22yre40b4iWr/SLK02Uhqr8ZeNPSpzoDdHmRThGE/zWqutLcURpgqthGFDSLo4XpcDLc0GKtC6pGAqEu6XxT27hDWGvkHMmM0iPi+JE9ByPq1xfZPGX5Ieab5TXCyTKf1mOH9JOz9pfcjH6VbcQLgNnqnAteJwujhv4phLfhSWmPVKqk8wsjxeYdoaa70WFtdpLnvbDp4o4DYm0H/5Jfq72lSh981lGaYnE17tvwU8Gf8t4xMe+r4wrgne74WsLT65oVJSCzl/IC/9cr618y0uf3KfhdLoQR8Bv/L+56J1Zfx+rfVxd4uPe69HLHmOPriSy/qj5lNcGv+Od7wY98yZLM27hWfBwL3SUr7wbEfxo2O38kXU+i6APS6qOz0av4B8gwTqh8/hs9PjQt6F6kQ0znKmZB3/D9DRQH24gzfgMz3QU2HeS2YZ9lhd1L4J0e83no1ezbzkKyrwF361Pp91c9PgXDm9DdEvgdl+HLPuYGfxO3GGkAbolcLuf+1q/N/MCf5C+uryHMwz7iVn7HxMv1pXH3Y2nbqv5D5f277vhRRk9JYF+ug3/EsD+NH75W+Er9izvpdtqPuC/6h/GPK1X3ro9cAL/0P/0jXTcR3cI3A0/7PS/vcthF7iH7hK4W88n+Jucc4bfb8C6W+D0YTfjYN0tcFP8XX7h69HVgLpf4OZwoO4dODnsCg7TYwYOrEcNHFQPDhyu9Uu668GB037FAunBgQvRLQ8NboEL0W24U+BC9ODAhejBgQvRgwOHAvTgwFW5vx4cuKrhiIceY0lNqaceZUn11eMsqZ56eOAeq5qfHiFwK2892j2cjy63toLv4Tz0iPdwcD1S4Pz0WIHz0knchwag3ohNgzgPDUA9513P1lph/R4aYPrwu7PWP8+HBpguN08myAHBAuejH4e9IpU/gWvuofejXTIFOmUeOFTfjPfoxr3ffexhgfPQC3WXRhn8w36//3UPnIee8o2TEk353c/bCYgDdbZhh7YFNfD6DPCk5nB9+3iRnlcpmv2CAXCgzq91/wnb2HtA4OB6wcTyvk/b4if8s5qD9W588/+Ed8FhOlvgMD+d0NoG/3nNwTqba+T+nSV6bjhMZ6eSqnb48EzvHQIH1tkC99gfF6+Ya+9Uc6h+5HPN+B9k4p1xkF6zXVLlioboOdYcqvPQddr7tOgBcJDO7msqor1R7b1r4KB6ykOnv1OpvXvNgTqba1A/eeuYB+EQXS5wU17+Ri3uLR1qDtP5UaTKdAIv1c/JuuEAnR99ulguI5tD4IA62yNGpfk6hYK7Hk1219nBgOkP+Y83N1cfHKCzJ7jpodui66+UjuruWHOQTuRZGIVuclSpkaPTr2S43soTGbJ1fVlRLezOgYPpR/WN7XlzkccFZEP4AjoL76z3bK65X5x0dYInnUaoQnkDOxDrrLPHF9oV57ykk1OPiOJr34HP4rrqhHdVjbewk03jdfzeVReH/UznTLO+a9vUrbVe+tl2xBRX7i0pPPRtrGOWiHrolf2agDZeJF31i/2SgDaeq131jSluXu1C4Hpxm16iNGUBdF9lmm2M1ncK4rsnFaX96X+6Sd+QJVtn128L2KIteaK/oP3pSiOv002PH3Xk/60z23Biuhs9X59/MkLL+in+H8vkkYUBrekNAAAAAElFTkSuQmCC" width="20"/>'
                                return `<image onclick="selecionarUsuario('${row[0]}', '${row[1]}', '${row[2]}', '${row[3]}', '${row[4]}', '${row[5]}')" title="editar" style="cursor: pointer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAb1BMVEX///89aIlz0PQ4ZYcxYYTS2uHs7/JAa4tmhJ3o7O9ef5pFbY14kqgtX4MhWH511Pk5YIFkq8xmsdJKeppNg6RIdZVouNu3xM+Oo7VbmblsvuCarb1vxOetvMlfn77Z4ObEzteCmq4ATXdUd5RUj7CLSUbIAAAFGUlEQVRoge3bbWOqIBgG4AxEzbC2tuVmHbX2/3/jqXhREIkHsE/jYyuvA88daHBWqwVb2uRlUub9sVhSMbdjiTFKkgRhijfda22yre40b4iWr/SLK02Uhqr8ZeNPSpzoDdHmRThGE/zWqutLcURpgqthGFDSLo4XpcDLc0GKtC6pGAqEu6XxT27hDWGvkHMmM0iPi+JE9ByPq1xfZPGX5Ieab5TXCyTKf1mOH9JOz9pfcjH6VbcQLgNnqnAteJwujhv4phLfhSWmPVKqk8wsjxeYdoaa70WFtdpLnvbDp4o4DYm0H/5Jfq72lSh981lGaYnE17tvwU8Gf8t4xMe+r4wrgne74WsLT65oVJSCzl/IC/9cr618y0uf3KfhdLoQR8Bv/L+56J1Zfx+rfVxd4uPe69HLHmOPriSy/qj5lNcGv+Od7wY98yZLM27hWfBwL3SUr7wbEfxo2O38kXU+i6APS6qOz0av4B8gwTqh8/hs9PjQt6F6kQ0znKmZB3/D9DRQH24gzfgMz3QU2HeS2YZ9lhd1L4J0e83no1ezbzkKyrwF361Pp91c9PgXDm9DdEvgdl+HLPuYGfxO3GGkAbolcLuf+1q/N/MCf5C+uryHMwz7iVn7HxMv1pXH3Y2nbqv5D5f277vhRRk9JYF+ug3/EsD+NH75W+Er9izvpdtqPuC/6h/GPK1X3ro9cAL/0P/0jXTcR3cI3A0/7PS/vcthF7iH7hK4W88n+Jucc4bfb8C6W+D0YTfjYN0tcFP8XX7h69HVgLpf4OZwoO4dODnsCg7TYwYOrEcNHFQPDhyu9Uu668GB037FAunBgQvRLQ8NboEL0W24U+BC9ODAhejBgQvRgwOHAvTgwFW5vx4cuKrhiIceY0lNqaceZUn11eMsqZ56eOAeq5qfHiFwK2892j2cjy63toLv4Tz0iPdwcD1S4Pz0WIHz0knchwag3ohNgzgPDUA9513P1lph/R4aYPrwu7PWP8+HBpguN08myAHBAuejH4e9IpU/gWvuofejXTIFOmUeOFTfjPfoxr3ffexhgfPQC3WXRhn8w36//3UPnIee8o2TEk353c/bCYgDdbZhh7YFNfD6DPCk5nB9+3iRnlcpmv2CAXCgzq91/wnb2HtA4OB6wcTyvk/b4if8s5qD9W588/+Ed8FhOlvgMD+d0NoG/3nNwTqba+T+nSV6bjhMZ6eSqnb48EzvHQIH1tkC99gfF6+Ya+9Uc6h+5HPN+B9k4p1xkF6zXVLlioboOdYcqvPQddr7tOgBcJDO7msqor1R7b1r4KB6ykOnv1OpvXvNgTqba1A/eeuYB+EQXS5wU17+Ri3uLR1qDtP5UaTKdAIv1c/JuuEAnR99ulguI5tD4IA62yNGpfk6hYK7Hk1219nBgOkP+Y83N1cfHKCzJ7jpodui66+UjuruWHOQTuRZGIVuclSpkaPTr2S43soTGbJ1fVlRLezOgYPpR/WN7XlzkccFZEP4AjoL76z3bK65X5x0dYInnUaoQnkDOxDrrLPHF9oV57ykk1OPiOJr34HP4rrqhHdVjbewk03jdfzeVReH/UznTLO+a9vUrbVe+tl2xBRX7i0pPPRtrGOWiHrolf2agDZeJF31i/2SgDaeq131jSluXu1C4Hpxm16iNGUBdF9lmm2M1ncK4rsnFaX96X+6Sd+QJVtn128L2KIteaK/oP3pSiOv002PH3Xk/60z23Biuhs9X59/MkLL+in+H8vkkYUBrekNAAAAAElFTkSuQmCC" width = "20" /> `

                            }
                        },
                        {
                            title: "Excluir",
                            sorting: false,
                            render: function (data, type, row, meta) {
                                return '<image onclick="confirmarDeletar(' + row[0] + ',\'' + row[1] + '\')" title="deletar" style="cursor: pointer" src="data:image/png;base64,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" width="20"/>'
                            }
                        }
                    ],
                    language: { url: "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Portuguese.json" },
                }
            );
        })

}

function removeLastCharacter(element, tamanho) {
    $(element).keyup(function () {
        if (this.value.length >= tamanho) {
            var valorMenosUltimoCaracter = this.value.substring(0, tamanho)
            $(element).val(valorMenosUltimoCaracter);
        }
    })
}

function removeFoco(element, tamanho, maximo) {
    $(element).focusout(function () {
        if (this.value.length >= tamanho) {
            var valorMenosUltimoCaracter = this.value.substring(0, tamanho)
            $(element).val(valorMenosUltimoCaracter);
        }
        if (parseInt(this.value) > maximo) {
            $(element).val(maximo);
        }
        if (parseInt(this.value) < 1) {
            $(element).val(1);
        }
    })
}

removeLastCharacter("#txtIdade", 3);
removeLastCharacter("#txtNumero", 3);

removeFoco("#txtIdade", 3, 100);
removeFoco("#txtNumero", 3, 500);

$(window).keydown(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        salvar();
    }
});

$(document).ready(
    function () {
        $("#txtCpf").mask("000.000.000-00", { reverse: true });

    }
)

function ApenasLetras(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        } else if (e) {
            var charCode = e.which;
        } else {
            return true;
        }
        if (
            (charCode > 64 && charCode < 91) ||
            (charCode > 96 && charCode < 123) ||
            (charCode > 191 && charCode <= 255) || // letras com acentos
            (charCode == 32)
        ) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        alert(err.Description);
    }
}

$("#txtNumero").on('input', function () {
    console.log(this)
});