//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 11/7/2010 1:11:01 PM
//--------------------------------------------------------------------------------
//
// Description: Clase de Acceso a datos para la entidad Catalogo
//--------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;

using ChildDataPIN.BLL.Entities.COM;
using ChildDataPIN.ApplicationHelper.Query;
using ChildDataPIN.ApplicationHelper.Services;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace ChildDataPIN.DAL.COM
{
    public class DeudaComunicacionesDAL : ComModuleDataAccess<Deuda>
    {
        /// <summary>
        /// Metodo que devuelve los registros de una tabla segun su id
        /// </summary>
        /// <param name="CatalogId"></param>
        /// <returns></returns>
        public Deuda TraerDatosTable(Guid id)
        {
            return TraerDatosTable(j => j.Id == id);
        }

        /// <summary>
        /// Metodo que devuelve todos los registros de la tabla
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public RetrieveMultipleResponse<Deuda> TaerMultiples(RetrieveMultipleRequest<Deuda> param)
        {
            param.SearchCondition = c => true;
            return TraerMultiples<Deuda>(param);
        }

        /// <summary>
        /// Metodo para hacer un bulk insert de los datos obtenidos a traves del data table a SQL
        /// </summary>
        /// <param name="deudaDataTable"></param>
        /// <returns></returns>
        public bool InsertarDatosDeArchivo(DataTable deudaDataTable)
        {
            using (SqlBulkCopy bc = new SqlBulkCopy(ConfigurationManager.ConnectionStrings["ChildDataPINConnectionString"].ToString()))
            {
                bc.DestinationTableName = "COM.Deuda";

                bc.ColumnMappings.Add("Id", "Id");
                bc.ColumnMappings.Add("SCNumber", "SCNumber");
                bc.ColumnMappings.Add("SCName", "SCName");
                bc.ColumnMappings.Add("NODescription", "NODescription");
                bc.ColumnMappings.Add("SPNumber", "SPNumber");
                bc.ColumnMappings.Add("CommunicationType", "CommunicationType");
                bc.ColumnMappings.Add("ResponseDue", "ResponseDue");
                bc.ColumnMappings.Add("Location", "Location");
                bc.ColumnMappings.Add("CommunityWorkerName", "CommunityWorkerName");
                bc.ColumnMappings.Add("ResponseStatus", "ResponseStatus");

                bc.WriteToServer(deudaDataTable);
            }

            return true;
        }
    }



}

