//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 15/02/2013 11:55 PM
//--------------------------------------------------------------------------------
//
// Description: Clase de Acceso a datos para la entidad Catalogo
//--------------------------------------------------------------------------------
using System;
using System.Linq;

using ChildDataPIN.BLL.Entities.BASE;
using ChildDataPIN.ApplicationHelper.Services;

namespace ChildDataPIN.DAL.BASE
{
    public class EntidadDAL : BaseModuleDataAccess<Entidad>
    {
        /// <summary>
        /// Metodo que devuelve los registros de la vista de catalogo segun su id
        /// </summary>
        /// <param name="CatalogId"></param>
        /// <returns></returns>
        public EntidadVista TraerDatosVW(Guid id)
        {
            return TraerDatosVW<EntidadVista>(j =>j.IdEntidad == id);
        }

        /// <summary>
        /// Metodo que devuelve los registros de una tabla segun su id
        /// </summary>
        /// <param name="CatalogId"></param>
        /// <returns></returns>
        public Entidad TraerDatosTable(Guid id)
        {
            return TraerDatosTable(j => j.IdEntidad == id);
        }

        /// <summary>
        /// Metodo que devuelve todos los registros de la tabla mapeado a una vista
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public RetrieveMultipleResponse<EntidadVista> TraerMultiples(RetrieveMultipleRequest<EntidadVista> param)
        {
            param.SearchCondition = c => (c.PrimerNombre.Contains(param.Search.PrimerNombre) || string.IsNullOrEmpty(param.Search.PrimerNombre) == true ||
                (c.PrimerApellido.Contains(param.Search.PrimerApellido) || string.IsNullOrEmpty(param.Search.PrimerApellido) == true ));
                
            return TraerMultiples<EntidadVista>(param);
        }

        /// <summary>
        /// Metodo para guardar un nuevo catalogo
        /// </summary>
        /// <param name="newCat"></param>
        /// <returns></returns>
        public Guid GuardarEntidad(Entidad entidad)
        {
            return ctx.EntidadInsertar(entidad.IdTipoEntidad, entidad.IdEstadoEntidad, entidad.IdTipoIdentificacion, entidad.CodigoIdentificacion, entidad.Direccion, entidad.Telefono, entidad.Email, entidad.CreadoPorIdUsuario, entidad.CreadoEn, entidad.CreadoEl, entidad.ModificadoPorIdUsuario, entidad.ModificadoEn, entidad.ModificadoEl).FirstOrDefault().Value;
        }

        /// <summary>
        /// Metodo para actualizar datos de un catalogo
        /// </summary>
        /// <param name="aCatalgo"></param>
        /// <returns></returns>
        public EntidadVista ActualizarEntidad(Entidad entidad)
        {
            Guid? Id;
            //el metodo que ira aqui, debe retornar un id, para luego hacer el retrieve from view
            Id = ctx.EntidadActualizar(entidad.IdEntidad, entidad.IdTipoEntidad, entidad.IdEstadoEntidad, entidad.IdTipoIdentificacion, entidad.CodigoIdentificacion, entidad.Direccion, entidad.Telefono, entidad.Email, entidad.ModificadoPorIdUsuario, entidad.ModificadoEn, entidad.ModificadoEl).FirstOrDefault().Value;

            return TraerDatosVW(Id.Value);

        }

    }
}

