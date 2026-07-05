
import { useState, useEffect } from 'react';
import type { MobileNetModel } from '../types';

export const useTensorFlow = () => {
    const [model, setModel] = useState<MobileNetModel | null>(null);
    const [modelStatus, setModelStatus] = useState<string>('Loading TF.js Model...');

    useEffect(() => {
        const loadModel = async () => {
            try {
                if (window.mobilenet) {
                    const loadedModel = await window.mobilenet.load();
                    setModel(loadedModel);
                    setModelStatus('Ready');
                } else {
                    setModelStatus('Error: MobileNet library not found.');
                }
            } catch (error) {
                console.error("Failed to load TensorFlow model:", error);
                setModelStatus('Error: Failed to load TF.js model.');
            }
        };

        loadModel();
    }, []);

    return { model, modelStatus };
};
