import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  query,
  where,
  arrayUnion,
  runTransaction,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "boot/firebase";
import { Timestamp } from "firebase/firestore";
// Timestamp.now();

export default function firestoreService() {
  const buscaGenericaPorIDRealTime = async (colecao, docID) => {
    try {
      const docRef = doc(db, colecao, docID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      //onsole.log(error);
    }
  };

  const salvaGenericaComID = async (colecao, docID, form) => {
    try {
      const docRef = doc(db, colecao, docID);

      const retorno = await setDoc(docRef, form, { merge: true });

      return docRef.id;
    } catch (error) {
      console.log(error);
    }
  };
  const buscarColecao = async (colecaoID) => {
    try {
      const colecaoRef = collection(db, colecaoID);
      const querySnapshot = await getDocs(colecaoRef);

      if (!querySnapshot.empty) {
        const dadosDaColecao = [];
        querySnapshot.forEach((doc) => {
          dadosDaColecao.push(doc.data());
        });

        return dadosDaColecao;
      } else {
        return null; // Ou lançar um erro, dependendo do seu caso de uso
      }
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  const deletarDocumentoPorID = async (colecao, docID) => {
    try {
      const docRef = doc(db, colecao, docID);
      await deleteDoc(docRef);
      console.log(
        `Documento ${docID} deletado com sucesso da coleção ${colecao}.`
      );
      return true;
    } catch (error) {
      console.error(`Erro ao deletar documento ${docID}:`, error);
      return false;
    }
  };

  const editarNomeDoDocumento = async (colecao, docID, novoNome) => {
    //console.log(colecao, docID, novoNome);
    try {
      const docRef = doc(db, colecao, docID);
      await updateDoc(docRef, {
        nome: novoNome,
      });
      console.log(`Campo 'nome' do documento ${docID} atualizado com sucesso.`);
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar nome do documento ${docID}:`, error);
      return false;
    }
  };

  return {
    buscaGenericaPorIDRealTime,
    buscaGenericaWhere,
    salvaGenericaSemID,
    salvaGenericaComID,
    salvaPesquisaCustom,
    salvaPerguntaCustom,
    buscarColecao,
    atualizarParametroDocumento,
    salvaCampanhaComprasCustom,
    buscaParticipanteCampanhaCustom,
    deletarDocumentoPorID,
    editarNomeDoDocumento,
  };
}
