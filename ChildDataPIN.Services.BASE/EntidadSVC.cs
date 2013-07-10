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
using ChildDataPIN.BLL.Components.BASE;
using ChildDataPIN.BLL.Entities.BASE;
using ChildDataPIN.Services.Contracts.BASE;

namespace ChildDataPIN.Services.BASE
{
    [ServiceBehavior(UseSynchronizationContext = false,
    ConcurrencyMode = ConcurrencyMode.Multiple,
    InstanceContextMode = InstanceContextMode.PerCall),
    AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class EntidadSVC : IEntidadSVC 
    {
        public EntidadSVC() { }

        /// <summary>
        /// Metodo que devuelve un registro existente o uno nuevo cuando el id es nulo
        /// </summary>
        /// <param name="catalogoId"></param>
        /// <returns></returns>
        public RetrieveSingleResponse<EntidadVista> TraerDatos(Guid? id)
        {
            RetrieveSingleResponse<EntidadVista> response = new RetrieveSingleResponse<EntidadVista>();

            try
            {
                using (EntidadBLL bc = new EntidadBLL())
                {
                    EntidadVista vwEntidad = null;

                    if (id.HasValue)
                        vwEntidad = bc.TraerDatosVW(id.Value);
                    else
                        vwEntidad = bc.TraerNuevo();

                    response.entity = vwEntidad;
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
        public ServiceCommandResponse<EntidadVista> CambioDeEstado(Guid id, int statusId)
        {
            ServiceCommandResponse<EntidadVista> response = new ServiceCommandResponse<EntidadVista>();

            try
            {
                using (EntidadBLL bc = new EntidadBLL())
                {
                    response.entity = new EntidadVista();
                    response.entity.IdEntidad = bc.CambioDeEstado(id, statusId);
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
        public RetrieveMultipleResponse<EntidadVista> TraerMultiples(string id,string search, int start, int limit, string sort, string dir)
        {
            RetrieveMultipleResponse<EntidadVista> response;
            try
            {
                RetrieveMultipleRequest<EntidadVista> param = new RetrieveMultipleRequest<EntidadVista>();
                param.PagingInfo = new PagingInfo(start, limit, sort, dir);
                param.Search = new EntidadVista();

                param.Search.PrimerNombre = search;
                param.Search.SegundoApellido= search;
                param.Search.SegundoApellido= search;
                param.Search.SegundoNombre = search;
               
                using (EntidadBLL bc = new EntidadBLL())
                {
                    response = bc.TraerMultiples(param);
                    response.success = true;
                }

            }
            catch (Exception ex)
            {
                response = new RetrieveMultipleResponse<EntidadVista>();
                response.ErrorMessage = ex.Message;
                
            }
            return response;
        }

        /// <summary>
        /// Metodo de creacion de un registro nuevo
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public ServiceCommandResponse<Entidad> Guardar(Entidad entidad)
        {
            ServiceCommandResponse<Entidad> response = new ServiceCommandResponse<Entidad>();

            try
            {
                using (EntidadBLL bc = new EntidadBLL())
                {
                    response.entity = bc.Guardar(entidad);
                    response.success = true;
                }


            }
            catch (Exception ex)
            {
                response.ErrorMessage = ex.Message + ex.StackTrace;
            }

            return response;
        }

        /// <summary>
        /// Metodo para la actualizacion de un registro existente
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public ServiceCommandResponse<EntidadVista> Actualizar(Entidad entidad)
        {
            ServiceCommandResponse<EntidadVista> response = new ServiceCommandResponse<EntidadVista>();

            try
            {
                using (EntidadBLL bc = new EntidadBLL())
                {
                    response.entity = bc.Actualizar(entidad);
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
