function setupStudyInfo(study_name){
    study_info = {
        study_name: study_name,
        data: {},
        measurement_info: {},
        dataset_info: {},
    };
    return study_info
}

function setupPublicationInfo(publication_name){
    publication_info = {
        publication_name: publication_name,
        study_info: {},
        data: {},
    };
    return publication_info
}

function setupMeasurementInfo(){
    measurement_info = {
        data: {},
    };
    return measurement_info
}

function setupDatasetInfo(dataset_name){
    dataset_info = {
        dataset_name: dataset_name,
        data: {},
    };
    return dataset_info
}