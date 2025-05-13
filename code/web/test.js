const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
// Capture o ARN do seu tópico SNS - substitua na linha abaixo
const SNS_TOPIC_ARN = 'arn:aws:sns:sa-east-1:929185123558:EventNotifications'; // Você precisará substituir com seu ARN

exports.handler = async (event) => {
    try {
        // Dados do evento (simulando dados de entrada)
        const eventData = {
            id: Date.now().toString(),
            eventName: event.eventName || 'Evento Padrão',
            description: event.description || 'Descrição padrão do evento',
            timestamp: new Date().toISOString()
        };
        console.log('Dados do evento a serem salvos:', eventData);
        // Parâmetros para salvar no DynaßmoDB
        const dynamoParams = {
            TableName: 'EventsTable',
            Item: eventData
        };
        // Salvar no DynamoDB
        console.log('Salvando no DynamoDB...');
        await dynamoDB.put(dynamoParams).promise();
        console.log('Dados salvos com sucesso no DynamoDB!');
        // Preparar mensagem para SNS
        const message = `Novo evento registrado: ${eventData.eventName}\n` + `Descrição: ${eventData.description}\n` + `Horário: ${eventData.timestamp}`
            ;
        // Parâmetros para publicação no SNS
        const snsParams = {
            TopicArn: SNS_TOPIC_ARN,
            Message: message,
            Subject: 'Notificação de Novo Evento'
        };
        // Publicar no SNS
        console.log('Enviando notificação via SNS...');
        await sns.publish(snsParams).promise();
        console.log('Notificação enviada com sucesso!');
        return {

            statusCode: 200,
            body: JSON.stringify({
                message: 'Evento registrado com sucesso!',
                eventId: eventData.id
            })
        };

    } catch (error) {

        console.error('Erro:', error);

        return {

            statusCode: 500,
            body: JSON.stringify({
                message: 'Erro ao processar o evento',
                error: error.message
            })

        };
    }
};