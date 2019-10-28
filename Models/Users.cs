using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;

namespace WebApplication1.Models
{
    public class Users
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(35)]
        public string Name { get; set; }

        [Range(0, 100)]
        public short Age { get; set; }

        public string CPF { get; set; }

        public string Address { get; set; }

        public int Number { get; set; }

        public IEnumerable<Users> Listar(string dbConn)
        {
            var usuarios = new List<Users>();
            var sql = "SELECT * FROM malta_Usuario WHERE deletado = 0";
            var connection = new SqlConnection(dbConn);
            try
            {
                connection.Open();
                var command = new SqlCommand(sql, connection);
                var dataReader = command.ExecuteReader();
                while (dataReader.Read())
                {
                    Users users = new Users()
                    {
                        Id = dataReader.GetInt32(0),
                        Name = dataReader.GetString(1),
                        Age = dataReader.GetInt16(2),
                        CPF = dataReader.GetString(3),
                        Address = dataReader.GetString(4),
                        Number = dataReader.GetInt32(5)

                    };
                    usuarios.Add(users);
                }
                dataReader.Close();
                command.Dispose();
                connection.Close();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return usuarios;

        }

        public int Create(Users user, string dbConn)
        {
            var connection = new SqlConnection(dbConn);

            connection.Open();

            try
            {
                var sql =
                @"BEGIN TRAN " +
                "INSERT INTO malta_Usuario VALUES('" + user.Name + "', " + user.Age + ", '" + user.CPF + "', '" + user.Address + "', " + user.Number + ", 0); " +
                "SELECT @@IDENTITY AS 'Id'";
                var command = new SqlCommand(sql, connection);
                var id = Convert.ToInt32(command.ExecuteScalar());

                var commit = "COMMIT";
                var commandCommit = new SqlCommand(commit, connection);
                commandCommit.ExecuteNonQuery();

                return id;
            }
            catch (Exception ex)
            {
                var rollback = "ROLLBACK";
                var rollbackCommit = new SqlCommand(rollback, connection);
                rollbackCommit.ExecuteNonQuery();

                throw new Exception("Não foi possível salvar o usuário");
            }
            finally
            {
                connection.Dispose();
                connection.Close();
            }
        }

        public bool Edit(Users user, string dbConn)
        {
            var connection = new SqlConnection(dbConn);

            connection.Open();

            try
            {
                var sql =
                    @"BEGIN TRY "+
                        "BEGIN TRAN " +
                            "UPDATE malta_Usuario SET Name = '" + user.Name + "', Age = " + user.Age + ", CPF = '" + user.CPF + "', Address = '" + user.Address + "', Number = " + user.Number + " WHERE Id = " + user.Id + " " +
                        "COMMIT "+
                    "END TRY " +
                    "BEGIN CATCH " +
                        "ROLLBACK " +
                    "END CATCH";

                var command = new SqlCommand(sql, connection);
                command.ExecuteNonQuery();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Não foi possível editar o usuário");
            }
            finally
            {
                connection.Dispose();
                connection.Close();
            }
        }

        public bool Deletar(int id, string dbConn)
        {
            var connection = new SqlConnection(dbConn);

            connection.Open();

            try
            {
                var sql =
                    @"BEGIN TRY " +
                        "BEGIN TRAN " +
                            "UPDATE malta_Usuario SET deletado = 1 WHERE Id = " + id + " " +
                        "COMMIT " +
                    "END TRY " +
                    "BEGIN CATCH " +
                        "ROLLBACK " +
                    "END CATCH";

                var command = new SqlCommand(sql, connection);
                command.ExecuteNonQuery();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Não foi possível deletar o usuário");
            }
            finally
            {
                connection.Dispose();
                connection.Close();
            }
        }
    }
}