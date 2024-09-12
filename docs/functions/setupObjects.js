function setupStudyInfo(study_name){
    study_info = {
        study_name: study_name,
        data: {},
        measurement_info: {},
        raw_data: {},
        condition_data: {},
        repetition_data: {},
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

function setupStatementSetInfo(statementset_name){
    statementset_info = {
        statementset_name: statementset_name,
        data: {},
    };
    return statementset_info
}