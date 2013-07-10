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

using ChildDataPIN.BLL.Entities.BASE;
using ChildDataPIN.ApplicationHelper.Query;
using ChildDataPIN.ApplicationHelper.Services;

namespace ChildDataPIN.DAL.BASE
{
    public class CoordinadorDAL : BaseModuleDataAccess<Coordinador>
    {
        /// <summary>
        /// Metodo que devuelve los registros de la vista de catalogo segun su id
        /// </summary>
        /// <param name="CatalogId"></param>
        /// <returns></returns>
        public CoordinadorVista TraerDatosVW(Guid id)
        {
            return TraerDatosVW<CoordinadorVista>(j =>j.IdCoordinador == id);
        }

        /// <summary>
        /// Metodo que devuelve los registros de una tabla segun su id
        /// </summary>
        /// <param name="CatalogId"></param>
        /// <returns></returns>
        public Coordinador TraerDatosTable(Guid id)
        {
            return TraerDatosTable(j => j.IdCoordinador == id);
        }

        /// <summary>
        /// Metodo que devuelve todos los registros de la tabla mapeado a una vista
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public RetrieveMultipleResponse<CoordinadorVista> TraerMultiples(RetrieveMultipleRequest<CoordinadorVista> param)
        {
            param.SearchCondition = c => (c.NombreCompleto.Contains(param.Search.NombreCompleto) || string.IsNullOrEmpty(param.Search.NombreCompleto) == true ||
                (c.Sexo.Contains(param.Search.Sexo) || string.IsNullOrEmpty(param.Search.Sexo) == true ||
                (c.Codigo.Contains(param.Search.Codigo) || string.IsNullOrEmpty(param.Search.Codigo) == true ||
                (c.EstadoCoordinador.Contains(param.Search.EstadoCoordinador) || string.IsNullOrEmpty(param.Search.EstadoCoordinador) == true))));
                
            return TraerMultiples<CoordinadorVista>(param);
        }

        /// <summary>
        /// Metodo para guardar un nuevo catalogo
        /// </summary>
        /// <param name="newCat"></param>
        /// <returns></returns>
        public Guid GuardarCoordinador(Coordinador coordinador)
        {
            return ctx.CoordinadorInsertar(coordinador.IdEntidad,coordinador.Codigo,coordinador.IdEstadoCoordinador,coordinador.Nota,coordinador.CreadoPorIdUsuario,coordinador.CreadoEn,coordinador.CreadoEl,coordinador.ModificadoPorIdUsuario,coordinador.ModificadoEn,coordinador.ModificadoEl).FirstOrDefault().Value;
        }

        /// <summary>
        /// Metodo para actualizar datos de un catalogo
        /// </summary>
        /// <param name="aCatalgo"></param>
        /// <returns></returns>
        public CoordinadorVista ActualizarCoordinador(Coordinador coordinador)
        {
            Guid? Id;
            //el metodo que ira aqui, debe retornar un id, para luego hacer el retrieve from view
            Id = ctx.CoordinadorActualizar(coordinador.IdCoordinador, coordinador.IdEntidad, coordinador.Codigo, coordinador.IdEstadoCoordinador, coordinador.Nota,coordinador.ModificadoPorIdUsuario,coordinador.ModificadoEn,coordinador.ModificadoEl).FirstOrDefault().Value;

            return TraerDatosVW(Id.Value);

        }

    }
}

