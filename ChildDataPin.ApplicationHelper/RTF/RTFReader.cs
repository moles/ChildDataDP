//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 07/31/2011 11:12:20 PM
//--------------------------------------------------------------------------------
//
// Descripcion: Clase para la lectura de RTF
//--------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

//RTF Library
using Net.Sgoliver.NRtfTree.Core;
using Net.Sgoliver.NRtfTree.Util;
using System.Text.RegularExpressions;

namespace ChildDataPIN.ApplicationHelper.RTF
{
    public class RTFReader
    {
        public static void LeerRtf() { }
        //public static void LeerRtf()
        //{
        //    //Cracion del objeto de tipo arbol rtf
        //    RtfTree arbolRTF = new RtfTree();

        //    //Activacion de la opcion de combinar caracteres especiales
        //    arbolRTF.MergeSpecialCharacters = true;

        //    //Carga del documento RTF desde un archivo indicando su ruta
        //    int resulatado = arbolRTF.LoadRtfFile("C:\\Monografia MFK\\ChildDataPIN\\ChildDataPin.ApplicationHelper\\RTF\\ArchivoRTF.RTF");

        //    //El valor 0 significa que se cargo satisfactoriamente, de lo contrario devolvera -1
        //    if (resulatado != 0)
        //        throw new Exception("ha ocurrido un error mientras se intentaba cargar el documento");
            
        //    //se obtiene el nodo raiz
        //    RtfTreeNode nodoRaiz = arbolRTF.RootNode;
        //    //Se obtiene el nodo padre de un nodo
        //    RtfTreeNode padre = nodoRaiz.ParentNode;
        //    //se obtienen los nodos hijos
        //    RtfNodeCollection hijos = nodoRaiz.ChildNodes;
        //    //
        //    //RtfTreeNode hermanoSiguiente = nodoRaiz.NextSibling;
        //    //RtfTreeNode hermanoAnterior = nodoRaiz.PreviousSibling;

            
            

        //}
    }
}
