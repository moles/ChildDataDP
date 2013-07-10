﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Data.EntityClient;
using System.Data.Metadata.Edm;
using System.Data.Objects.DataClasses;
using System.Data.Objects;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using ChildDataPIN.BLL.Entities.SEG;


namespace ChildDataPIN.DAL.SEG
{
    public partial class SegEntities : ObjectContext
    {
        public const string ConnectionString = "name=SegEntities";
        public const string ContainerName = "SegEntities";
    
        #region Constructors
    
        public SegEntities()
            : base(ConnectionString, ContainerName)
        {
            Initialize();
        }
    
        public SegEntities(string connectionString)
            : base(connectionString, ContainerName)
        {
            Initialize();
        }
    
        public SegEntities(EntityConnection connection)
            : base(connection, ContainerName)
        {
            Initialize();
        }
    
        private void Initialize()
        {
            // Creating proxies requires the use of the ProxyDataContractResolver and
            // may allow lazy loading which can expand the loaded graph during serialization.
            ContextOptions.ProxyCreationEnabled = false;
            ObjectMaterialized += new ObjectMaterializedEventHandler(HandleObjectMaterialized);
        }
    
        private void HandleObjectMaterialized(object sender, ObjectMaterializedEventArgs e)
        {
            var entity = e.Entity as IObjectWithChangeTracker;
            if (entity != null)
            {
                bool changeTrackingEnabled = entity.ChangeTracker.ChangeTrackingEnabled;
                try
                {
                    entity.MarkAsUnchanged();
                }
                finally
                {
                    entity.ChangeTracker.ChangeTrackingEnabled = changeTrackingEnabled;
                }
                this.StoreReferenceKeyValues(entity);
            }
        }
    
        #endregion
    
        #region ObjectSet Properties
    
        public ObjectSet<Usuario> Usuario
        {
            get { return _usuario  ?? (_usuario = CreateObjectSet<Usuario>("Usuario")); }
        }
        private ObjectSet<Usuario> _usuario;
    
        public ObjectSet<ChildDP_VW_Usuario> ChildDP_VW_Usuario
        {
            get { return _childDP_VW_Usuario  ?? (_childDP_VW_Usuario = CreateObjectSet<ChildDP_VW_Usuario>("ChildDP_VW_Usuario")); }
        }
        private ObjectSet<ChildDP_VW_Usuario> _childDP_VW_Usuario;

        #endregion
        #region Function Imports
        public virtual ObjectResult<Nullable<System.Guid>> ChildDP_SP_Usuario_Insertar(string primer_nombre, string segundo_nombre, string primer_apellido, string segundo_apellido, string alias, Nullable<bool> activo, Nullable<System.Guid> regpor, string regen, Nullable<System.DateTime> regel, Nullable<System.DateTime> actel, Nullable<System.Guid> actpor, string acten)
        {
    
            ObjectParameter primer_nombreParameter;
    
            if (primer_nombre != null)
            {
                primer_nombreParameter = new ObjectParameter("primer_nombre", primer_nombre);
            }
            else
            {
                primer_nombreParameter = new ObjectParameter("primer_nombre", typeof(string));
            }
    
            ObjectParameter segundo_nombreParameter;
    
            if (segundo_nombre != null)
            {
                segundo_nombreParameter = new ObjectParameter("segundo_nombre", segundo_nombre);
            }
            else
            {
                segundo_nombreParameter = new ObjectParameter("segundo_nombre", typeof(string));
            }
    
            ObjectParameter primer_apellidoParameter;
    
            if (primer_apellido != null)
            {
                primer_apellidoParameter = new ObjectParameter("primer_apellido", primer_apellido);
            }
            else
            {
                primer_apellidoParameter = new ObjectParameter("primer_apellido", typeof(string));
            }
    
            ObjectParameter segundo_apellidoParameter;
    
            if (segundo_apellido != null)
            {
                segundo_apellidoParameter = new ObjectParameter("segundo_apellido", segundo_apellido);
            }
            else
            {
                segundo_apellidoParameter = new ObjectParameter("segundo_apellido", typeof(string));
            }
    
            ObjectParameter aliasParameter;
    
            if (alias != null)
            {
                aliasParameter = new ObjectParameter("alias", alias);
            }
            else
            {
                aliasParameter = new ObjectParameter("alias", typeof(string));
            }
    
            ObjectParameter activoParameter;
    
            if (activo.HasValue)
            {
                activoParameter = new ObjectParameter("activo", activo);
            }
            else
            {
                activoParameter = new ObjectParameter("activo", typeof(bool));
            }
    
            ObjectParameter regporParameter;
    
            if (regpor.HasValue)
            {
                regporParameter = new ObjectParameter("regpor", regpor);
            }
            else
            {
                regporParameter = new ObjectParameter("regpor", typeof(System.Guid));
            }
    
            ObjectParameter regenParameter;
    
            if (regen != null)
            {
                regenParameter = new ObjectParameter("regen", regen);
            }
            else
            {
                regenParameter = new ObjectParameter("regen", typeof(string));
            }
    
            ObjectParameter regelParameter;
    
            if (regel.HasValue)
            {
                regelParameter = new ObjectParameter("regel", regel);
            }
            else
            {
                regelParameter = new ObjectParameter("regel", typeof(System.DateTime));
            }
    
            ObjectParameter actelParameter;
    
            if (actel.HasValue)
            {
                actelParameter = new ObjectParameter("actel", actel);
            }
            else
            {
                actelParameter = new ObjectParameter("actel", typeof(System.DateTime));
            }
    
            ObjectParameter actporParameter;
    
            if (actpor.HasValue)
            {
                actporParameter = new ObjectParameter("actpor", actpor);
            }
            else
            {
                actporParameter = new ObjectParameter("actpor", typeof(System.Guid));
            }
    
            ObjectParameter actenParameter;
    
            if (acten != null)
            {
                actenParameter = new ObjectParameter("acten", acten);
            }
            else
            {
                actenParameter = new ObjectParameter("acten", typeof(string));
            }
            return base.ExecuteFunction<Nullable<System.Guid>>("ChildDP_SP_Usuario_Insertar", primer_nombreParameter, segundo_nombreParameter, primer_apellidoParameter, segundo_apellidoParameter, aliasParameter, activoParameter, regporParameter, regenParameter, regelParameter, actelParameter, actporParameter, actenParameter);
        }
        public virtual ObjectResult<Nullable<System.Guid>> ChildDP_SP_Usuario_Actualizar(Nullable<System.Guid> idUsuario, string primer_nombre, string segundo_nombre, string primer_apellido, string segundo_apellido, string alias, Nullable<bool> activo, Nullable<System.Guid> regpor, string regen, Nullable<System.DateTime> regel, Nullable<System.DateTime> actel, Nullable<System.Guid> actpor, string acten)
        {
    
            ObjectParameter idUsuarioParameter;
    
            if (idUsuario.HasValue)
            {
                idUsuarioParameter = new ObjectParameter("IdUsuario", idUsuario);
            }
            else
            {
                idUsuarioParameter = new ObjectParameter("IdUsuario", typeof(System.Guid));
            }
    
            ObjectParameter primer_nombreParameter;
    
            if (primer_nombre != null)
            {
                primer_nombreParameter = new ObjectParameter("primer_nombre", primer_nombre);
            }
            else
            {
                primer_nombreParameter = new ObjectParameter("primer_nombre", typeof(string));
            }
    
            ObjectParameter segundo_nombreParameter;
    
            if (segundo_nombre != null)
            {
                segundo_nombreParameter = new ObjectParameter("segundo_nombre", segundo_nombre);
            }
            else
            {
                segundo_nombreParameter = new ObjectParameter("segundo_nombre", typeof(string));
            }
    
            ObjectParameter primer_apellidoParameter;
    
            if (primer_apellido != null)
            {
                primer_apellidoParameter = new ObjectParameter("primer_apellido", primer_apellido);
            }
            else
            {
                primer_apellidoParameter = new ObjectParameter("primer_apellido", typeof(string));
            }
    
            ObjectParameter segundo_apellidoParameter;
    
            if (segundo_apellido != null)
            {
                segundo_apellidoParameter = new ObjectParameter("segundo_apellido", segundo_apellido);
            }
            else
            {
                segundo_apellidoParameter = new ObjectParameter("segundo_apellido", typeof(string));
            }
    
            ObjectParameter aliasParameter;
    
            if (alias != null)
            {
                aliasParameter = new ObjectParameter("alias", alias);
            }
            else
            {
                aliasParameter = new ObjectParameter("alias", typeof(string));
            }
    
            ObjectParameter activoParameter;
    
            if (activo.HasValue)
            {
                activoParameter = new ObjectParameter("activo", activo);
            }
            else
            {
                activoParameter = new ObjectParameter("activo", typeof(bool));
            }
    
            ObjectParameter regporParameter;
    
            if (regpor.HasValue)
            {
                regporParameter = new ObjectParameter("regpor", regpor);
            }
            else
            {
                regporParameter = new ObjectParameter("regpor", typeof(System.Guid));
            }
    
            ObjectParameter regenParameter;
    
            if (regen != null)
            {
                regenParameter = new ObjectParameter("regen", regen);
            }
            else
            {
                regenParameter = new ObjectParameter("regen", typeof(string));
            }
    
            ObjectParameter regelParameter;
    
            if (regel.HasValue)
            {
                regelParameter = new ObjectParameter("regel", regel);
            }
            else
            {
                regelParameter = new ObjectParameter("regel", typeof(System.DateTime));
            }
    
            ObjectParameter actelParameter;
    
            if (actel.HasValue)
            {
                actelParameter = new ObjectParameter("actel", actel);
            }
            else
            {
                actelParameter = new ObjectParameter("actel", typeof(System.DateTime));
            }
    
            ObjectParameter actporParameter;
    
            if (actpor.HasValue)
            {
                actporParameter = new ObjectParameter("actpor", actpor);
            }
            else
            {
                actporParameter = new ObjectParameter("actpor", typeof(System.Guid));
            }
    
            ObjectParameter actenParameter;
    
            if (acten != null)
            {
                actenParameter = new ObjectParameter("acten", acten);
            }
            else
            {
                actenParameter = new ObjectParameter("acten", typeof(string));
            }
            return base.ExecuteFunction<Nullable<System.Guid>>("ChildDP_SP_Usuario_Actualizar", idUsuarioParameter, primer_nombreParameter, segundo_nombreParameter, primer_apellidoParameter, segundo_apellidoParameter, aliasParameter, activoParameter, regporParameter, regenParameter, regelParameter, actelParameter, actporParameter, actenParameter);
        }

        #endregion
    }
}