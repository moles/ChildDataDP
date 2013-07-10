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

using ChildDataPIN.BLL.Entities.SEG;
using ChildDataPIN.ApplicationHelper.Query;
using ChildDataPIN.ApplicationHelper.Services;

namespace ChildDataPIN.DAL.SEG
{
    public class UsuarioDAL : SegModuleDataAccess<Usuario>
    {
        /// <summary>
        /// Metodo que devuelve los registros de la vista de usuario segun su id
        /// </summary>
        /// <param name="CatalogId"></param>
        /// <returns></returns>
        public  ChildDP_VW_Usuario TraerDatosVW(Guid id)
        {
            return TraerDatosVW<ChildDP_VW_Usuario>(j => j.IdUsuario == id);
        }

        /// <summary>
        /// Metodo que devuelve los registros de una tabla segun su id
        /// </summary>
        /// <param name="CatalogId"></param>
        /// <returns></returns>
        public Usuario TraerDatosTable(Guid id)
        {
            return TraerDatosTable(j => j.IdUsuario == id);
        }

        /// <summary>
        /// Metodo que devuelve todos los registros de la tabla mapeado a una vista
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public RetrieveMultipleResponse<ChildDP_VW_Usuario> TaerMultiples(RetrieveMultipleRequest<ChildDP_VW_Usuario> param)
        {

            param.SearchCondition = c => (c.primer_nombre.Contains(param.Search.primer_nombre) || string.IsNullOrEmpty(param.Search.primer_nombre) == true ||
                                           (c.segundo_nombre.Contains(param.Search.segundo_nombre) || string.IsNullOrEmpty(param.Search.segundo_nombre) == true));

            return TraerMultiples<ChildDP_VW_Usuario>(param);
        }

        /// <summary>
        /// Metodo para guardar un nuevo usuario
        /// </summary>
        /// <param name="newCat"></param>
        /// <returns></returns>
        public Guid GuardarUsuario(Usuario usuario)
        {
            return ctx.ChildDP_SP_Usuario_Insertar(usuario.primer_nombre, usuario.segundo_nombre, usuario.primer_apellido, usuario.segundo_apellido, usuario.alias,usuario.activo, usuario.regpor, usuario.regen, usuario.regel, usuario.actel, usuario.actpor, usuario.acten).FirstOrDefault().Value;
        }

        /// <summary>
        /// Metodo para actualizar datos de un catalogo
        /// </summary>
        /// <param name="aCatalgo"></param>
        /// <returns></returns>
        public ChildDP_VW_Usuario ActualizarUsuario(Usuario usuario)
        {
            Guid? Id;
            //el metodo que ira aqui, debe retornar un id, para luego hacer el retrieve from view
            Id = ctx.ChildDP_SP_Usuario_Actualizar(usuario.IdUsuario, usuario.primer_nombre, usuario.segundo_nombre,usuario.primer_apellido,usuario.segundo_apellido,usuario.alias,usuario.activo,usuario.regpor,usuario.regen,usuario.regel,usuario.actel,usuario.actpor,usuario.acten).FirstOrDefault().Value;

            return TraerDatosVW(Id.Value);
        }

    }



}

