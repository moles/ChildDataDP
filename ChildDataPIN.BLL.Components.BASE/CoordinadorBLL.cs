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
    public sealed class CoordinadorBLL : BaseBusinessComponent
    {
        CoordinadorDAL dac;

        public CoordinadorBLL()
            : base(new CoordinadorDAL())
        {
            dac = (CoordinadorDAL)base.dac;
        }

        /// <summary>
        /// Metado para traer datos segun el id de catalogo
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public CoordinadorVista TraerDatosVW(Guid id)
        {
            return dac.TraerDatosVW(id);
        }

        /// <summary>
        /// Metodo para traer registros de un nuevo catalogo
        /// </summary>
        /// <returns></returns>
        public CoordinadorVista TraerNuevo()
        {
            CoordinadorVista vwCoordinador = new CoordinadorVista();

            //vwCoordinador.EstadoCoordinador = true;
            vwCoordinador.CreadoEl = DateTime.Now;
            //vwCoordinador.CreadoPorIdUsuario = 1;
            vwCoordinador.CreadoEn = System.Net.IPAddress.Loopback.ToString();
            vwCoordinador.ModificadoEl = DateTime.Now;
            //vwCoordinador. = 1;
            vwCoordinador.ModificadoEn = System.Net.IPAddress.Loopback.ToString();


            return vwCoordinador;
        }

        /// <summary>
        /// Metodo que devuelve multiples registros de una tabla segun parametros de busqueda
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public RetrieveMultipleResponse<CoordinadorVista> TraerMultiples(RetrieveMultipleRequest<CoordinadorVista> param)
        {
            return dac.TraerMultiples(param);
        }

        /// <summary>
        /// Metodo para guardar un nuevo catalogo
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public Coordinador Guardar(Coordinador coordinador)
        {
            using (TransactionScope ts = new TransactionScope())
            {
                //Coordinador.EstadoCoordinador = true;
                coordinador.CreadoEl = DateTime.Now;
                //vwCoordinador.CreadoPorIdUsuario = 1;
                coordinador.CreadoEn = System.Net.IPAddress.Loopback.ToString();
                coordinador.ModificadoEl = DateTime.Now;
                //vwCoordinador. = 1;
                coordinador.ModificadoEn = System.Net.IPAddress.Loopback.ToString();

                ts.Complete();
            }

            return coordinador;
        }

        /// <summary>
        /// Metodo para actualizar catalogos existentes
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public CoordinadorVista Actualizar(Coordinador coordinador)
        {
            CoordinadorVista vwCoordinador = null;

            using (TransactionScope ts = new TransactionScope())
            {
                Coordinador currentcoordinador = dac.TraerDatosTable(coordinador.IdCoordinador);

                //Aqui deberan ir todos los campos que se desean actualizar

                currentcoordinador.Codigo = coordinador.Codigo;
                //currentcoordinador.primer_nombre = coordinador.primer_nombre;
                //currentcoordinador.segundo_nombre = coordinador.segundo_nombre;
                //currentcoordinador.primer_apellido = coordinador.primer_apellido;
                //currentcoordinador.segundo_apellido = coordinador.segundo_apellido;
                //currentcoordinador.regpor = coordinador.regpor;
                //currentcoordinador.regen = System.Net.IPAddress.Loopback.ToString();
                //currentcoordinador.regel = coordinador.regel;
                //currentcoordinador.actpor = coordinador.actpor;
                //currentcoordinador.actel = coordinador.actel;
                //currentcoordinador.acten = System.Net.IPAddress.Loopback.ToString();


                vwCoordinador = dac.ActualizarCoordinador(currentcoordinador);

                ts.Complete();
            }

            return vwCoordinador;
        }

        public Guid CambioDeEstado(Guid id, int statusId)
        {
            using (TransactionScope ts = new TransactionScope())
            {
                Coordinador currentCoordinador = dac.TraerDatosTable(id);

                //currentCoordinador.activo = statusId == 1 ? true : false;

                dac.Actualizar(currentCoordinador);

                ts.Complete();
            }

            return id;
        }
    }
}
