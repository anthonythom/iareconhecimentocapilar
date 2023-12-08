import { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import  './AfroGlow_v2.json';
import { useDropzone } from 'react-dropzone'; 
import './index.css'

const ImageClassification = () => {
    const [image, setImage] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const classifyImage = async (imgTensor) => {
        setIsLoading(true);
    
        try {
            // Carrega o modelo a partir do JSON
            const model = await tf.loadLayersModel(tf.io.browserHTTPRequest('./AfroGlow_v2.json'));

    
            // Realiza a classificação na imagem tensor
            const predictions = await model.classify(imgTensor);
    
            // Atualiza o estado com as previsões
            setPredictions(predictions);
        } catch (error) {
            console.error("Erro ao carregar ou classificar o modelo:", error);
        } finally {
            // Define isLoading para false, independentemente do resultado
            setIsLoading(false);
        }
    };

    const handleImageUpload = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(URL.createObjectURL(file));

        const imgElement = document.createElement("img");
        imgElement.src = URL.createObjectURL(file);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleImageUpload,
        accept: 'image/*',
        maxSize: 5000000,
        disabled: !!image, 
    });

    return (
        <section className="wrapper">
            <h2>Revolucione seu cuidado com o cabelo <br/> com a nossa IA! </h2>
            <div className="reqRes">
                <div className="box1" {...getRootProps()}>
                    <input {...getInputProps()} />

                    <img className="imgUp" src="./upload.png" alt="upload" />
                   
                        <p>
                            <p className="pYellow">Arraste</p> e solte uma imagem ou clique para <p className="pYellow">selecionar</p>
                        </p>
                  
                    {image && (
                        <>
                            <div className="img-wrapper">
                                <img src={image} alt="Uploaded" />
                            </div>

                            <button className="btn-action"onClick={classifyImage} disabled={isLoading} >
                                {isLoading ? "Analisando..." : "Analisar"}
                            </button>
                        </>
                    )}
                </div>

                <div className="box2">
                    {predictions.length > 0 && (
                        <>
                            <h3 className="title">Resultado</h3>
                            <ul className="list-result">
                                {predictions.map((prediction, index) => (
                                    <li key={index} className="result">
                                        {prediction.className} :{" "}
                                        <strong>{Math.round(prediction.probability * 100)}%</strong>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ImageClassification;