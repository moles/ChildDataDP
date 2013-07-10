//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 11/13/2010 2:49:20 PM
//--------------------------------------------------------------------------------
//
// Description: Clase de Negocio para la entidad catalogos
//--------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Transactions;

using ChildDataPIN.DAL.BASE;
using ChildDataPIN.BLL.Entities.BASE;
using ChildDataPIN.ApplicationHelper.Services;
using ChildDataPIN.ApplicationHelper.Query;
using ChildDataPIN.ApplicationHelper;
using System.Xml.Linq;

namespace ChildDataPIN.BLL.Components.BASE
{
    public sealed class EntidadBLL : BaseBusinessComponent
    {
        EntidadDAL dac;

        public EntidadBLL()
            : base(new EntidadDAL())
        {
            dac = (EntidadDAL)base.dac;
        }

        /// <summary>
        /// Metado para traer datos segun el id de catalogo
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public EntidadVista TraerDatosVW(Guid id)
        {
            return dac.TraerDatosVW(id);
        }

        /// <summary>
        /// Metodo para traer registros de un nuevo catalogo
        /// </summary>
        /// <returns></returns>
        public EntidadVista TraerNuevo()
        {
            EntidadVista vwEntidad = new EntidadVista();

            vwEntidad.CreadoPorIdUsuario = ApplicationHelper.Configuracion.IdUsuario;
            vwEntidad.CreadoPorUsuario = ApplicationHelper.Configuracion.NombreUsuario;
            vwEntidad.CreadoEn = System.Net.IPAddress.Loopback.ToString();
            vwEntidad.CreadoEl = DateTime.Now;
            vwEntidad.ModificadoPorIdUsuario = ApplicationHelper.Configuracion.IdUsuario;
            vwEntidad.ModificadoPorUsuario = ApplicationHelper.Configuracion.NombreUsuario;
            vwEntidad.ModificadoEl = DateTime.Now;
            vwEntidad.ModificadoEn = System.Net.IPAddress.Loopback.ToString();

            return vwEntidad;
        }

        /// <summary>
        /// Metodo que devuelve multiples registros de una tabla segun parametros de busqueda
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public RetrieveMultipleResponse<EntidadVista> TraerMultiples(RetrieveMultipleRequest<EntidadVista> param)
        {
            return dac.TraerMultiples(param);
        }

        /// <summary>
        /// Metodo para guardar un nuevo catalogo
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public Entidad Guardar(Entidad entidad)
        {
            using (TransactionScope ts = new TransactionScope())
            {
                entidad.IdEstadoEntidad = EstadoEntidad.Activo;
                entidad.CreadoEl = DateTime.Now;
                entidad.CreadoPorIdUsuario = ApplicationHelper.Configuracion.IdUsuario;
                entidad.CreadoEn = System.Net.IPAddress.Loopback.ToString();
                entidad.ModificadoPorIdUsuario = ApplicationHelper.Configuracion.IdUsuario;
                entidad.ModificadoEl = DateTime.Now;
                entidad.ModificadoEn = System.Net.IPAddress.Loopback.ToString();

                ts.Complete();
            }

            return entidad;
        }

        /// <summary>
        /// Metodo para actualizar catalogos existentes
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public EntidadVista Actualizar(Entidad entidad)
        {
            EntidadVista vwEntidad = null;

            using (TransactionScope ts = new TransactionScope())
            {
                Entidad currententidad = dac.TraerDatosTable(entidad.IdEntidad);

                //Aqui deberan ir todos los campos que se desean actualizar

                //currententidad.Codigo = entidad.Codigo;
                //currententidad.primer_nombre = entidad.primer_nombre;
                //currententidad.segundo_nombre = entidad.segundo_nombre;
                //currententidad.primer_apellido = entidad.primer_apellido;
                //currententidad.segundo_apellido = entidad.segundo_apellido;
                //currententidad.regpor = entidad.regpor;
                //currententidad.regen = System.Net.IPAddress.Loopback.ToString();
                //currententidad.regel = entidad.regel;
                //currententidad.actpor = entidad.actpor;
                //currententidad.actel = entidad.actel;
                //currententidad.acten = System.Net.IPAddress.Loopback.ToString();


                vwEntidad = dac.ActualizarEntidad(currententidad);

                ts.Complete();
            }

            return vwEntidad;
        }

        public Guid CambioDeEstado(Guid id, int statusId)
        {
            using (TransactionScope ts = new TransactionScope())
            {
                Entidad currentEntidad = dac.TraerDatosTable(id);

                //currentEntidad.activo = statusId == 1 ? true : false;

                dac.Actualizar(currentEntidad);

                ts.Complete();
            }

            return id;
        }
    }
}
