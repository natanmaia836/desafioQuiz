
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
  const buscaGenericaWhere = async (colecao, chave, condicao, valor) => {
    try {


      const lista = [];

      const q = query(collection(db, colecao), where(chave, condicao, valor));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        lista.push(doc.data());
        //console.log(doc.id, " => ", doc.data());
      });
      //

      return lista;
    } catch (error) {
      //console.log(error);


    }
  };
  const salvaGenericaSemID = async (colecao, form) => {
    try {

      const docRef = doc(collection(db, colecao));
      form.id = docRef.id;
      await setDoc(docRef, form);

      //console.log(docRef);
      return docRef.id;
    } catch (error) {
      //console.log(error);


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
  const atualizarParametroDocumento = async (
    colecao,
    docID,
    parametro,
    novoValor
  ) => {
    try {


      const docRef = doc(db, colecao, docID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Obtenha os dados atuais do documento
        const dadosAtuais = docSnap.data();

        // Verifique se o parâmetro existe no documento
        if (dadosAtuais[parametro] !== undefined) {
          // Atualize o valor do parâmetro
          dadosAtuais[parametro] = novoValor;

          // Atualize o documento no Firestore
          await setDoc(docRef, dadosAtuais);


          return {
            sucesso: true,
            mensagem: "Parâmetro atualizado com sucesso.",
          };
        } else {

          return {
            sucesso: false,
            mensagem: "O parâmetro especificado não existe no documento.",
          };
        }
      } else {

        return { sucesso: false, mensagem: "Documento não encontrado." };
      }
    } catch (error) {
      // console.log(error);

      return {
        sucesso: false,
        mensagem: "Erro na atualização do parâmetro do documento.",
      };
    } finally {

    }
  };

  // Metodos Custom a Baixo
  // Metodo somente para a coleção PESQUISA
  const salvaPesquisaCustom = async (respostas) => {
    try {
      //console.log(respostas);

      const docRef = doc(db, "pesquisas", respostas.pesquisaId);
      //console.log(docRef);
      const retorno = await setDoc(
        docRef,
        { respostas: arrayUnion(respostas) },
        { merge: true }
      );
      //console.log(retorno);

      MsgSucesso("Obrigado por participar");
      return true;
    } catch (error) {
      // console.log(error);


      return false;
    }
  };
  const salvaPerguntaCustom = async (perguntas) => {
    try {
      //console.log(respostas);

      const docRef = doc(db, "pesquisas", "0_Cadastro_De_Perguntas");
      //console.log(docRef);
      const retorno = await setDoc(
        docRef,
        { perguntas: arrayUnion(perguntas) },
        { merge: true }
      );
      //console.log(retorno);

      MsgSucesso("Nova pergunta criada!");
      return retorno;
    } catch (error) {
      // console.log(error);


    }
  };
  // Metodo somente para a coleção campanhas de compra
  const salvaCampanhaComprasCustom = async (idDoc, participacao) => {
    try {
      //console.log(respostas);

      // const docRef = doc(db, "campanhas_de_compra", idDoc);
      // const retorno = await setDoc(
      //   docRef,
      //   { participantes: arrayUnion(participacao) },
      //   { merge: true }
      // );
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, "campanhas_de_compra", idDoc);
        const docSnapshot = await transaction.get(docRef);
        const participantesAtual = docSnapshot.get("participantes");

        // Localiza o item dentro do array
        const itemEncontrado = participantesAtual.find(
          (item) => item.cpf === participacao.cpf
        );

        // Se não tiver na lista ainda cria um novo item no array
        if (!itemEncontrado) {
          participantesAtual.push(participacao);
        } else {
          //Hidrata o objeto se já existir na lista
          itemEncontrado.compras = participacao.compras;
          itemEncontrado.brinde_entregue = participacao.brinde_entregue;
          itemEncontrado.datado = Timestamp.now();
          itemEncontrado.total_compras = participacao.total_compras;
        }

        // // Gravar o array atualizado de volta no documento
        transaction.update(docRef, { participantes: participantesAtual });
      });
      //console.log(retorno);

      MsgSucesso("Obrigado por participar");
      return true;
    } catch (error) {
      // console.log(error);


      return false;
    }
  };
  const buscaParticipanteCampanhaCustom = async (docID, idParticipante) => {
    try {


      const docRef = doc(db, "campanhas_de_compra", docID);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const arrayMapas = data.participantes; // Aqui pega um array que tiver no docuemnto com nome participanetes

      // Filtrar os mapas dentro do array que correspondem ao CPF
      const itensComCPF = arrayMapas.filter(
        (item) => item.cpf === idParticipante
      );
      //

      return itensComCPF;
    } catch (error) {
      // console.log(error);


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
  };
}
