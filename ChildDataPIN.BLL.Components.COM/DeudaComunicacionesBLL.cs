//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 03/23/2012 10:49:20 PM
//------------------------------------------------------------------------------------------------
//
// Description: Clase de Negocio para la entidad de Deudas de comunicaciones
//              Esta entidad trabaja de forma temporal para ingresar las deudas en una sola tabla
//------------------------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ChildDataPIN.BLL.Entities.COM;
using ChildDataPIN.DAL.COM;
using System.Transactions;
using ChildDataPin.ApplicationHelper;
using ChildDataPIN.ApplicationHelper.Services;

namespace ChildDataPIN.BLL.Components.COM
{
    public class DeudaComunicacionesBLL : ComBusinessComponent
    {
        DeudaComunicacionesDAL dac;

        public DeudaComunicacionesBLL()
            : base(new DeudaComunicacionesDAL())
        {
            dac = (DeudaComunicacionesDAL)base.dac;                    
        }

        public RetrieveMultipleResponse<Deuda> TraerMultiples(RetrieveMultipleRequest<Deuda> param)
        {
            return dac.TraerMultiples(param);
        }

        /// <summary>
        /// Metodo que crea la definicion por cada campo y su tipo de datos para el objeto datatable de deudas
        /// </summary>
        /// <returns></returns>
        public DataTable CrearDefinicionTablaDeudas()
        {
            DataTable dataTable = new DataTable();
            Deuda table = new Deuda();

            dataTable.Columns.Add("Id", table.Id.GetType());
            dataTable.Columns.Add("SCNumber", Type.GetType("System.Int32"));
            dataTable.Columns.Add("SCName", Type.GetType("System.String"));
            dataTable.Columns.Add("NODescription", Type.GetType("System.String"));
            dataTable.Columns.Add("SPNumber", Type.GetType("System.Int32"));
            dataTable.Columns.Add("CommunicationType", Type.GetType("System.String"));
            dataTable.Columns.Add("ResponseDue", Type.GetType("System.DateTime"));
            dataTable.Columns.Add("Location", Type.GetType("System.String"));
            dataTable.Columns.Add("CommunityWorkerName", Type.GetType("System.String"));
            dataTable.Columns.Add("ResponseStatus", Type.GetType("System.Int32"));

            return dataTable;
        }

        /// <summary>
        /// Metodo para leer cada una de las filas dentro del archivo
        /// </summary>
        /// <param name="archivoDataTable"></param>
        /// <param name="deudaDataTable"></param>
        /// <returns></returns>
        private DataTable leerFilas(DataTable archivoDataTable, DataTable deudaDataTable)
        {
            DataRow dataRow;
            int line = 1;

            foreach (DataRow row in archivoDataTable.Rows)
            {
                dataRow = deudaDataTable.NewRow();

                //En total el archivo tiene 9 columnas, si las 9 columnas traen un valor nulo entonces esa fila no se debe leer.
                //No se porque pero las columnas empiezan en el indice 19
                if (row[19] == DBNull.Value && row[20] == DBNull.Value &&
                    row[21] == DBNull.Value && row[22] == DBNull.Value &&
                    row[23] == DBNull.Value && row[24] == DBNull.Value &&
                    row[25] == DBNull.Value && row[26] == DBNull.Value &&
                    row[27] == DBNull.Value) continue;

                if (row[19] != DBNull.Value && row[19].ToString() == "end")
                    break;

                dataRow["Id"] = Guid.NewGuid();
                dataRow["SCNumber"] = row["SCNumber"];
                dataRow["SCName"] = row["SCName"];
                dataRow["NODescription"] = row["NODescription"];
                dataRow["SPNumber"] = row["Sp Number"];
                dataRow["CommunicationType"] = row["CommunicationType"];
                dataRow["ResponseDue"] = DateTime.Now; // row["ResponseDue"];
                dataRow["Location"] = row["Location"];
                dataRow["CommunityWorkerName"] = row["CommunityWorkerName"];
                dataRow["ResponseStatus"] = row["ResponseStatus"];
                
                deudaDataTable.Rows.Add(dataRow);
                line += 1;
            }

            return deudaDataTable;
        }

        /// <summary>
        /// Metodo para guardas los registros del archivo de excel a su tabla correspondiente
        /// </summary>
        /// <param name="deudasExcelFile"></param>
        /// <param name="sheet"></param>
        public void GuardarDeudas(string deudasExcelFile, string sheet)
        {
            using (TransactionScope ts = new TransactionScope(TransactionScopeOption.Suppress))
            {
                DataTable fileDataTable = new DataTable();
                DataTable deudaDataTable = new DataTable();

                using (DeudaComunicacionesDAL deudasDAL = new DeudaComunicacionesDAL())
                {
                    LeerXLS xls = new LeerXLS();
                    {
                        fileDataTable = xls.LeerDatosDeExcel(deudasExcelFile, sheet);
                    }
                    deudaDataTable  = CrearDefinicionTablaDeudas();

                    deudaDataTable = leerFilas(fileDataTable, deudaDataTable);
                }       

                dac.InsertarDatosDeArchivo(deudaDataTable);
                ts.Complete();
            }
        }
    }
}
