//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 03/23/2012 10:09:20 PM
//--------------------------------------------------------------------------------
//
// Description: Clase Utilitaria para leer archivos de excel
//--------------------------------------------------------------------------------

using System.Data;
using System.Transactions;
using System.Data.OleDb;
using System;

namespace ChildDataPin.ApplicationHelper
{
    public class LeerXLS
    {
        /// <summary>
        /// Metodo para leer archivos de excel
        /// </summary>
        /// <param name="excelFile"></param>
        /// <param name="sheet"></param>
        /// <returns></returns>
        public DataTable LeerDatosDeExcel(string excelFile, string sheet)
        {
            string connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + excelFile + ";Extended Properties=Excel 12.0;";
            DataTable fullTable = new DataTable();

            using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Suppress))
            {
                OleDbConnection connection = new System.Data.OleDb.OleDbConnection(connectionString);

                try
                {
                    connection.Open();

                    DataTable dataTable = connection.GetSchema("Tables");

                    if ((dataTable != null) && dataTable.Rows.Count > 0)
                    {
                        DataRow[] rows = null;

                        if (string.IsNullOrEmpty(sheet))
                            rows = dataTable.Select("TABLE_NAME like '%$'");
                        else
                            rows = dataTable.Select("TABLE_NAME like '''" + sheet + "$'''");

                        if ((rows != null))
                        {
                            int i = 0;

                            foreach (DataRow row in rows)
                            {
                                string query = string.Format("Select * FROM [{0}]", row["table_name"].ToString());

                                OleDbCommand oleDBCommand = new OleDbCommand(query, connection);

                                OleDbDataReader dataReader = oleDBCommand.ExecuteReader();
                                DataTable currentDataTable = dataReader.GetSchemaTable();
                                
                                currentDataTable.Load(dataReader);

                                fullTable.Merge(currentDataTable);

                                ++i;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    connection.Close();
                }
            }
            
            return fullTable;
        }
    }
}
