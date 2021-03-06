//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Runtime.Serialization;

namespace ChildDataPIN.BLL.Entities.BASE
{
    [DataContract(IsReference = false)]
    public partial class CoordinadorVista: IObjectWithChangeTracker, INotifyPropertyChanged
    {
        #region Primitive Properties
    
        [DataMember]
        public System.Guid IdCoordinador
        {
            get { return _idCoordinador; }
            set
            {
                if (_idCoordinador != value)
                {
                    if (ChangeTracker.ChangeTrackingEnabled && ChangeTracker.State != ObjectState.Added)
                    {
                        throw new InvalidOperationException("The property 'IdCoordinador' is part of the object's key and cannot be changed. Changes to key properties can only be made when the object is not being tracked or is in the Added state.");
                    }
                    _idCoordinador = value;
                    OnPropertyChanged("IdCoordinador");
                }
            }
        }
        private System.Guid _idCoordinador;
    
        [DataMember]
        public System.Guid IdEntidad
        {
            get { return _idEntidad; }
            set
            {
                if (_idEntidad != value)
                {
                    _idEntidad = value;
                    OnPropertyChanged("IdEntidad");
                }
            }
        }
        private System.Guid _idEntidad;
    
        [DataMember]
        public string NombreCompleto
        {
            get { return _nombreCompleto; }
            set
            {
                if (_nombreCompleto != value)
                {
                    _nombreCompleto = value;
                    OnPropertyChanged("NombreCompleto");
                }
            }
        }
        private string _nombreCompleto;
    
        [DataMember]
        public string Sexo
        {
            get { return _sexo; }
            set
            {
                if (_sexo != value)
                {
                    _sexo = value;
                    OnPropertyChanged("Sexo");
                }
            }
        }
        private string _sexo;
    
        [DataMember]
        public string Codigo
        {
            get { return _codigo; }
            set
            {
                if (_codigo != value)
                {
                    _codigo = value;
                    OnPropertyChanged("Codigo");
                }
            }
        }
        private string _codigo;
    
        [DataMember]
        public System.Guid IdEstadoCoordinador
        {
            get { return _idEstadoCoordinador; }
            set
            {
                if (_idEstadoCoordinador != value)
                {
                    _idEstadoCoordinador = value;
                    OnPropertyChanged("IdEstadoCoordinador");
                }
            }
        }
        private System.Guid _idEstadoCoordinador;
    
        [DataMember]
        public string EstadoCoordinador
        {
            get { return _estadoCoordinador; }
            set
            {
                if (_estadoCoordinador != value)
                {
                    _estadoCoordinador = value;
                    OnPropertyChanged("EstadoCoordinador");
                }
            }
        }
        private string _estadoCoordinador;
    
        [DataMember]
        public string Nota
        {
            get { return _nota; }
            set
            {
                if (_nota != value)
                {
                    _nota = value;
                    OnPropertyChanged("Nota");
                }
            }
        }
        private string _nota;
    
        [DataMember]
        public System.Guid CreadoPorIdUsuario
        {
            get { return _creadoPorIdUsuario; }
            set
            {
                if (_creadoPorIdUsuario != value)
                {
                    _creadoPorIdUsuario = value;
                    OnPropertyChanged("CreadoPorIdUsuario");
                }
            }
        }
        private System.Guid _creadoPorIdUsuario;
    
        [DataMember]
        public string CreadoPorUsuario
        {
            get { return _creadoPorUsuario; }
            set
            {
                if (_creadoPorUsuario != value)
                {
                    _creadoPorUsuario = value;
                    OnPropertyChanged("CreadoPorUsuario");
                }
            }
        }
        private string _creadoPorUsuario;
    
        [DataMember]
        public string CreadoEn
        {
            get { return _creadoEn; }
            set
            {
                if (_creadoEn != value)
                {
                    _creadoEn = value;
                    OnPropertyChanged("CreadoEn");
                }
            }
        }
        private string _creadoEn;
    
        [DataMember]
        public System.DateTime CreadoEl
        {
            get { return _creadoEl; }
            set
            {
                if (_creadoEl != value)
                {
                    _creadoEl = value;
                    OnPropertyChanged("CreadoEl");
                }
            }
        }
        private System.DateTime _creadoEl;
    
        [DataMember]
        public System.Guid ModificadoPorIdUsuario
        {
            get { return _modificadoPorIdUsuario; }
            set
            {
                if (_modificadoPorIdUsuario != value)
                {
                    _modificadoPorIdUsuario = value;
                    OnPropertyChanged("ModificadoPorIdUsuario");
                }
            }
        }
        private System.Guid _modificadoPorIdUsuario;
    
        [DataMember]
        public string ModificadoPorUsuario
        {
            get { return _modificadoPorUsuario; }
            set
            {
                if (_modificadoPorUsuario != value)
                {
                    _modificadoPorUsuario = value;
                    OnPropertyChanged("ModificadoPorUsuario");
                }
            }
        }
        private string _modificadoPorUsuario;
    
        [DataMember]
        public string ModificadoEn
        {
            get { return _modificadoEn; }
            set
            {
                if (_modificadoEn != value)
                {
                    _modificadoEn = value;
                    OnPropertyChanged("ModificadoEn");
                }
            }
        }
        private string _modificadoEn;
    
        [DataMember]
        public System.DateTime ModificadoEl
        {
            get { return _modificadoEl; }
            set
            {
                if (_modificadoEl != value)
                {
                    _modificadoEl = value;
                    OnPropertyChanged("ModificadoEl");
                }
            }
        }
        private System.DateTime _modificadoEl;

        #endregion
        #region ChangeTracking
    
        protected virtual void OnPropertyChanged(String propertyName)
        {
            if (ChangeTracker.State != ObjectState.Added && ChangeTracker.State != ObjectState.Deleted)
            {
                ChangeTracker.State = ObjectState.Modified;
            }
            if (_propertyChanged != null)
            {
                _propertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    
        protected virtual void OnNavigationPropertyChanged(String propertyName)
        {
            if (_propertyChanged != null)
            {
                _propertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    
        event PropertyChangedEventHandler INotifyPropertyChanged.PropertyChanged{ add { _propertyChanged += value; } remove { _propertyChanged -= value; } }
        private event PropertyChangedEventHandler _propertyChanged;
        private ObjectChangeTracker _changeTracker;
    
        [DataMember]
        public ObjectChangeTracker ChangeTracker
        {
            get
            {
                if (_changeTracker == null)
                {
                    _changeTracker = new ObjectChangeTracker();
                    _changeTracker.ObjectStateChanging += HandleObjectStateChanging;
                }
                return _changeTracker;
            }
            set
            {
                if(_changeTracker != null)
                {
                    _changeTracker.ObjectStateChanging -= HandleObjectStateChanging;
                }
                _changeTracker = value;
                if(_changeTracker != null)
                {
                    _changeTracker.ObjectStateChanging += HandleObjectStateChanging;
                }
            }
        }
    
        private void HandleObjectStateChanging(object sender, ObjectStateChangingEventArgs e)
        {
            if (e.NewState == ObjectState.Deleted)
            {
                ClearNavigationProperties();
            }
        }
    
        protected bool IsDeserializing { get; private set; }
    
        [OnDeserializing]
        public void OnDeserializingMethod(StreamingContext context)
        {
            IsDeserializing = true;
        }
    
        [OnDeserialized]
        public void OnDeserializedMethod(StreamingContext context)
        {
            IsDeserializing = false;
            ChangeTracker.ChangeTrackingEnabled = true;
        }
    
        protected virtual void ClearNavigationProperties()
        {
        }

        #endregion
    }
}
