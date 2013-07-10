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
    [KnownType(typeof(Persona))]
    public partial class EstadoPersona: IObjectWithChangeTracker, INotifyPropertyChanged
    {
        #region Primitive Properties
    
        [DataMember]
        public System.Guid IdEstadoPersona
        {
            get { return _idEstadoPersona; }
            set
            {
                if (_idEstadoPersona != value)
                {
                    if (ChangeTracker.ChangeTrackingEnabled && ChangeTracker.State != ObjectState.Added)
                    {
                        throw new InvalidOperationException("The property 'IdEstadoPersona' is part of the object's key and cannot be changed. Changes to key properties can only be made when the object is not being tracked or is in the Added state.");
                    }
                    _idEstadoPersona = value;
                    OnPropertyChanged("IdEstadoPersona");
                }
            }
        }
        private System.Guid _idEstadoPersona;
    
        [DataMember]
        public string Descripcion
        {
            get { return _descripcion; }
            set
            {
                if (_descripcion != value)
                {
                    _descripcion = value;
                    OnPropertyChanged("Descripcion");
                }
            }
        }
        private string _descripcion;
    
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
        #region Navigation Properties
    
        [DataMember]
        public TrackableCollection<Persona> Persona
        {
            get
            {
                if (_persona == null)
                {
                    _persona = new TrackableCollection<Persona>();
                    _persona.CollectionChanged += FixupPersona;
                }
                return _persona;
            }
            set
            {
                if (!ReferenceEquals(_persona, value))
                {
                    if (ChangeTracker.ChangeTrackingEnabled)
                    {
                        throw new InvalidOperationException("Cannot set the FixupChangeTrackingCollection when ChangeTracking is enabled");
                    }
                    if (_persona != null)
                    {
                        _persona.CollectionChanged -= FixupPersona;
                    }
                    _persona = value;
                    if (_persona != null)
                    {
                        _persona.CollectionChanged += FixupPersona;
                    }
                    OnNavigationPropertyChanged("Persona");
                }
            }
        }
        private TrackableCollection<Persona> _persona;

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
            Persona.Clear();
        }

        #endregion
        #region Association Fixup
    
        private void FixupPersona(object sender, NotifyCollectionChangedEventArgs e)
        {
            if (IsDeserializing)
            {
                return;
            }
    
            if (e.NewItems != null)
            {
                foreach (Persona item in e.NewItems)
                {
                    item.EstadoPersona = this;
                    if (ChangeTracker.ChangeTrackingEnabled)
                    {
                        if (!item.ChangeTracker.ChangeTrackingEnabled)
                        {
                            item.StartTracking();
                        }
                        ChangeTracker.RecordAdditionToCollectionProperties("Persona", item);
                    }
                }
            }
    
            if (e.OldItems != null)
            {
                foreach (Persona item in e.OldItems)
                {
                    if (ReferenceEquals(item.EstadoPersona, this))
                    {
                        item.EstadoPersona = null;
                    }
                    if (ChangeTracker.ChangeTrackingEnabled)
                    {
                        ChangeTracker.RecordRemovalFromCollectionProperties("Persona", item);
                    }
                }
            }
        }

        #endregion
    }
}
