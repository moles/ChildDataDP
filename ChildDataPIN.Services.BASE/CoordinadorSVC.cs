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
    public class CoordinadorSVC : ICoordinadorSVC 
    {
        public CoordinadorSVC() { }

        /// <summary>
        /// Metodo que devuelve un registro existente o uno nuevo cuando el id es nulo
        /// </summary>
        /// <param name="catalogoId"></param>
        /// <returns></returns>
        public RetrieveSingleResponse<CoordinadorVista> TraerDatos(Guid? id)
        {
            RetrieveSingleResponse<CoordinadorVista> response = new RetrieveSingleResponse<CoordinadorVista>();

            try
            {
                using (CoordinadorBLL bc = new CoordinadorBLL())
                {
                    CoordinadorVista vwCoordinador = null;

                    if (id.HasValue)
                        vwCoordinador = bc.TraerDatosVW(id.Value);
                    else
                        vwCoordinador = bc.TraerNuevo();

                    response.entity = vwCoordinador;
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
        public ServiceCommandResponse<CoordinadorVista> CambioDeEstado(Guid id, int statusId)
        {
            ServiceCommandResponse<CoordinadorVista> response = new ServiceCommandResponse<CoordinadorVista>();

            try
            {
                using (CoordinadorBLL bc = new CoordinadorBLL())
                {
                    response.entity = new CoordinadorVista();
                    response.entity.IdCoordinador = bc.CambioDeEstado(id, statusId);
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
        public RetrieveMultipleResponse<CoordinadorVista> TraerMultiples(string id,string search, int start, int limit, string sort, string dir)
        {
            RetrieveMultipleResponse<CoordinadorVista> response;
            try
            {
                RetrieveMultipleRequest<CoordinadorVista> param = new RetrieveMultipleRequest<CoordinadorVista>();
                param.PagingInfo = new PagingInfo(start, limit, sort, dir);
                param.Search = new CoordinadorVista();

                param.Search.NombreCompleto = search;
                param.Search.Sexo= search;
                param.Search.Codigo = search;
                param.Search.EstadoCoordinador = search;
               
                using (CoordinadorBLL bc = new CoordinadorBLL())
                {
                    response = bc.TraerMultiples(param);
                    response.success = true;
                }

            }
            catch (Exception ex)
            {
                response = new RetrieveMultipleResponse<CoordinadorVista>();
                response.ErrorMessage = ex.Message;
                
            }
            return response;
        }

        /// <summary>
        /// Metodo de creacion de un registro nuevo
        /// </summary>
        /// <param name="catalogo"></param>
        /// <returns></returns>
        public ServiceCommandResponse<Coordinador> Guardar(Coordinador coordinador)
        {
            ServiceCommandResponse<Coordinador> response = new ServiceCommandResponse<Coordinador>();

            try
            {
                using (CoordinadorBLL bc = new CoordinadorBLL())
                {
                    response.entity = bc.Guardar(coordinador);
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
        public ServiceCommandResponse<CoordinadorVista> Actualizar(Coordinador coordinador)
        {
            ServiceCommandResponse<CoordinadorVista> response = new ServiceCommandResponse<CoordinadorVista>();

            try
            {
                using (CoordinadorBLL bc = new CoordinadorBLL())
                {
                    response.entity = bc.Actualizar(coordinador);
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
