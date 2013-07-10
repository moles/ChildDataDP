//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 11/13/2010 2:49:20 PM
//--------------------------------------------------------------------------------
//
// Description: Clase de Negocio para la entidad catalogos
//--------------------------------------------------------------------------------
using System;
using System.Transactions;
using ChildDataPIN.BLL.Components.BASE;
using ChildDataPIN.DAL.SEG;
using ChildDataPIN.BLL.Entities.SEG;
using ChildDataPIN.ApplicationHelper.Services;
using ChildDataPIN.ApplicationHelper;

namespace ChildDataPIN.BLL.Components.SEG
{
    public sealed class UsuarioBLL : SegBusinessComponent
    {
        UsuarioDAL dac;
        Guid IdUsuario;

        public UsuarioBLL()
            : base(new UsuarioDAL())
        {
            dac = (UsuarioDAL)base.dac;
            IdUsuario = Configuracion.IdUsuario;
        }

        /// <summary>
        /// Metado para traer datos segun el id de catalogo
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ChildDP_VW_Usuario TraerDatosVW(Guid id)
        {
            return dac.TraerDatosVW(id);
        }

        /// <summary>
        /// Metodo para traer registros de un nuevo catalogo
        /// </summary>
        /// <returns></returns>
        public ChildDP_VW_Usuario TraerNuevo()
        {
            ChildDP_VW_Usuario vwUsuario = new ChildDP_VW_Usuario();
            vwUsuario.actpor = IdUsuario;
            vwUsuario.regpor = IdUsuario;
            vwUsuario.regel = DateTime.Now;
            vwUsuario.actel = DateTime.Now;

            return vwUsuario;
        }

        /// <summary>
        /// Metodo que devuelve multiples registros de una tabla segun parametros de busqueda
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public RetrieveMultipleResponse<ChildDP_VW_Usuario> TraerMultiples(RetrieveMultipleRequest<ChildDP_VW_Usuario> param)
        {
            return dac.TaerMultiples(param);
        }

        /// <summary>
        /// Metodo para guardar un nuevo usuario
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public Usuario Guardar(Usuario usuario)
        {
            using (TransactionScope ts = new TransactionScope())
            {
                usuario.activo = true;
                usuario.regel = DateTime.Now;
                usuario.actel = DateTime.Now;
                usuario.acten = System.Net.IPAddress.Loopback.ToString();
                usuario.regen = System.Net.IPAddress.Loopback.ToString();

                usuario.IdUsuario = dac.GuardarUsuario(usuario);
                
                ts.Complete();
            }

            return usuario;
        }

        /// <summary>
        /// Metodo para actualizar usuarios existentes
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public ChildDP_VW_Usuario Actualizar(Usuario usuario)
        {
            ChildDP_VW_Usuario vwUsuario = null;

            using (TransactionScope ts = new TransactionScope())
            {
                Usuario currentusuario = dac.TraerDatosTable(usuario.IdUsuario);

                //Aqui deberan ir todos los campos que se desean actualizar

                currentusuario.primer_nombre = usuario.primer_nombre;
                currentusuario.segundo_nombre = usuario.segundo_nombre;
                currentusuario.primer_apellido = usuario.primer_apellido;
                currentusuario.segundo_apellido = usuario.segundo_apellido;
                currentusuario.alias = usuario.alias;
                currentusuario.activo = usuario.activo;

                vwUsuario = dac.ActualizarUsuario(currentusuario);

                ts.Complete();
            }

            return vwUsuario;
        }

    }

}
