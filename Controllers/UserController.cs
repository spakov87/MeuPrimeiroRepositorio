using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using WebApplication1.Models;
using System.Data;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace WebApplication1.Controllers
{
    public class UserController : Controller
    {
        #region Attributes
        public IConfiguration configuracao;
        private int idUser;
        readonly string dbConn;
        public Users Users = new Users();
        #endregion

        public UserController(IConfiguration iConfig)
        {
            configuracao = iConfig;
            dbConn = configuracao.GetSection("ConnectionString").Value;
        }

        #region Public Methods
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ListarUsuarios()
        {
            return Json(Users.Listar(dbConn));
        }


        [HttpPost]
        public object Create(Users user)
        {
            try
            {
                var idadeValida = user.Age > 0;
                var nomeValido = !string.IsNullOrEmpty(user.Name);
                var cpfPreenchido = !string.IsNullOrEmpty(user.CPF);
                var enderecoValido = !string.IsNullOrEmpty(user.Address);
                var numeroValido = user.Number > 0;

                if (idadeValida && nomeValido && cpfPreenchido && enderecoValido && numeroValido)
                {
                    var cpfValido = ValidarCpf(user.CPF);

                    if (cpfValido)
                    {
                        var id = Users.Create(user, dbConn);

                        return id;
                    }
                    throw new ArgumentException("Valor errado");
                }
                else
                    throw new ArgumentException("Valor errado");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]
        public object Edit(Users user)
        {
            try
            {
                var idadeValida = user.Age > 0;
                var nomePreenchido = !string.IsNullOrEmpty(user.Name);
                var cpfPreenchido = !string.IsNullOrEmpty(user.CPF);
                var enderecoPreenchido = !string.IsNullOrEmpty(user.Address);
                var numeroValido = user.Number > 0;

                if (idadeValida && nomePreenchido && cpfPreenchido && enderecoPreenchido && numeroValido)
                {
                    var cpfValido = ValidarCpf(user.CPF);

                    if (cpfValido)
                    {
                        var id = Users.Edit(user, dbConn);

                        return true;
                    }
                    throw new ArgumentException("Cpf inválido");
                }

                if (!idadeValida)
                    throw new ArgumentException("Idade inválida");
                if (!nomePreenchido)
                    throw new ArgumentException("Nome não preenchido");
                if (!cpfPreenchido)
                    throw new ArgumentException("CPF não preenchido");
                if (!enderecoPreenchido)
                    throw new ArgumentException("Endereço não preenchido");

                throw new ArgumentException("Numero inválido");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        [HttpDelete]
        public bool Delete(int id)
        {
            return Users.Deletar(id, dbConn);
        }
        #endregion


        #region Private Methods

        private bool ValidarCpf(string cpf)
        {

            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;

            cpf = cpf.Trim();
            cpf = cpf.Replace(".", "").Replace("-", "");

            if (cpf.Length != 11)
                return false;

            switch (cpf)
            {
                case "00000000000":
                    return false;
                case "11111111111":
                    return false;
                case "22222222222":
                    return false;
                case "33333333333":
                    return false;
                case "44444444444":
                    return false;
                case "55555555555":
                    return false;
                case "66666666666":
                    return false;
                case "77777777777":
                    return false;
                case "88888888888":
                    return false;
                case "99999999999":
                    return false;
            }

            tempCpf = cpf.Substring(0, 9);
            soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCpf = tempCpf + digito;
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();
            return cpf.EndsWith(digito);

        }
        #endregion
    }
}