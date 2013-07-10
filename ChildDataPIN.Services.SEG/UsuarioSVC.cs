//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 11/13/2010 3:15:44 PM
//--------------------------------------------------------------------------------
//
// Description: {A brief description of what this class or enumeration does or is for} //
//--------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;

using ChildDataPIN.ApplicationHelper.Services;
using ChildDataPIN.BLL.Components.SEG;
using ChildDataPIN.BLL.Entities.SEG;
using ChildDataPIN.Services.Contracts.SEG;
using ChildDataPIN.BLL.Components.BASE;

namespace ChildDataPIN.Services.SEG
{
    [ServiceBehavior(UseSynchronizationContext = false,
    ConcurrencyMode = ConcurrencyMode.Multiple,
    InstanceContextMode = InstanceContextMode.PerCall),
    AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UsuarioSVC : IUsuarioSVC
    {
        public UsuarioSVC() { }

        /// <summary>
        /// Metodo que devuelve un registro existente o uno nuevo cuando el id es nulo
        /// </summary>
        /// <param name="catalogoId"></param>
        /// <returns></returns>
        public RetrieveSingleResponse<ChildDP_VW_Usuario> TraerDatos(Guid? id)
        {
            RetrieveSingleResponse<ChildDP_VW_Usuario> response = new RetrieveSingleResponse<ChildDP_VW_Usuario>();

            try
            {
                using (UsuarioBLL bc = new UsuarioBLL())
                {
                    ChildDP_VW_Usuario vwUsuario = null;

                    if (id.HasValue)
                        vwUsuario = bc.TraerDatosVW(id.Value);
                    else
                        vwUsuario = bc.TraerNuevo();

                    response.entity = vwUsuario;
                    response.totalCount = 1;
                    response.success = true;
                }

            }
            catch (Exception ex)
            {
                response.Exception = ex;
            }

            return response;
        }

        /// <summary>
        /// Metodo para cambio de estados
        /// </summary>
        /// <param name="catalogoId"></param>
        /// <param name="statusId"></param>
        /// <returns></returns>
        public ServiceCommandResponse<ChildDP_VW_Usuario> CambioDeEstado(Guid id, int statusId)
        {
            ServiceCommandResponse<ChildDP_VW_Usuario> response = new ServiceCommandResponse<ChildDP_VW_Usuario>();

            try
            {
                using (UsuarioBLL bc = new UsuarioBLL())
                {
                    response.entity = new ChildDP_VW_Usuario();
                    //response.entity.IdUsuario = bc.CambioDeEstado(id, statusId);
                    response.success = true;
                    response.totalCount = 1;
                    //TODO: Hay que implementar el cambio de estado aqui
                }

            }
            catch (Exception ex)
            {
                response.Exception = ex;
            }

            return response;
        }

        /// <summary>
        /// Metodo que devuelve todos los registros existentes
        /// este metodo sera utilizado en las grillas
        /// </summary>
        /// <param name="id"></param>
        /// <param name="search"></param>
        /// <param name="start"></param>
        /// <param name="limit"></param>
        /// <param name="sort"></param>
        /// <param name="dir"></param>
        /// <returns></returns>
        public RetrieveMultipleResponse<ChildDP_VW_Usuario> TraerMultiples(string id,string search, int start, int limit, string sort, string dir)
        {
            RetrieveMultipleResponse<ChildDP_VW_Usuario> response;
            try
            {
                RetrieveMultipleRequest<ChildDP_VW_Usuario> param = new RetrieveMultipleRequest<ChildDP_VW_Usuario>();
                param.PagingInfo = new PagingInfo(start, limit, sort, dir);
                param.Search = new ChildDP_VW_Usuario();

                param.Search.primer_nombre = search;
                param.Search.segundo_nombre = search;
                param.Search.primer_apellido = search;
                param.Search.segundo_apellido = search;
                param.Search.alias = search;
                

                using (UsuarioBLL bc = new UsuarioBLL())
                {
                    response = bc.TraerMultiples(param);
                    response.success = true;
                }

            }
            catch (Exception ex)
            {
                response = new RetrieveMultipleResponse<ChildDP_VW_Usuario>();
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        /// <summary>
        /// Metodo de creacion de un registro nuevo
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public ServiceCommandResponse<Usuario> Guardar(Usuario usuario)
        {
            ServiceCommandResponse<Usuario> response = new ServiceCommandResponse<Usuario>();

            try
            {
                using (UsuarioBLL bc = new UsuarioBLL())
                {
                    response.entity = bc.Guardar(usuario);
                    response.success = true;
                }


            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                    response.ErrorMessage = ex.InnerException.Message;
                else
                    response.ErrorMessage = ex.Message;

                response.Exception = ex;
            }

            return response;
        }

        /// <summary>
        /// Metodo para la actualizacion de un registro existente
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public ServiceCommandResponse<ChildDP_VW_Usuario> Actualizar(Usuario usuario)
        {
            ServiceCommandResponse<ChildDP_VW_Usuario> response = new ServiceCommandResponse<ChildDP_VW_Usuario>();

            try
            {
                using (UsuarioBLL bc = new UsuarioBLL())
                {
                    response.entity = bc.Actualizar(usuario);
                    response.success = true;
                }
            }
            catch (Exception ex)
            {
                response.Exception = ex;
            }
            return response;
        }

    }
}
