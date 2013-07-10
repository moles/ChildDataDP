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
using System.ServiceModel.Web;
using System.Runtime.Serialization;

using ChildDataPIN.ApplicationHelper.Services;
using ChildDataPIN.BLL.Entities.SEG;

namespace ChildDataPIN.Services.Contracts.SEG
{
    [ServiceContract(Namespace = "ChildDataPIN.Services.Contracts.SEG")]
    public interface IUsuarioSVC
    {
        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        RetrieveSingleResponse<ChildDP_VW_Usuario> TraerDatos(Guid? id);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json)]
        ServiceCommandResponse<ChildDP_VW_Usuario> CambioDeEstado(Guid id, int statusId);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        RetrieveMultipleResponse<ChildDP_VW_Usuario> TraerMultiples(string id, string search, int start, int limit, string sort, string dir);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json)]
        ServiceCommandResponse<Usuario> Guardar(Usuario usuario);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        ServiceCommandResponse<ChildDP_VW_Usuario> Actualizar(Usuario usuario);

    }

}

