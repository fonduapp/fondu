import host from '../constants/Server.js';
import invariant from 'invariant';
import isomorphicFetch from 'isomorphic-fetch';
import fetchRetry from 'fetch-retry';
import { AsyncStorage } from 'react-native';

const isomorphicFetchRetry = fetchRetry(isomorphicFetch);

// GET params should appear in the same order they do in the request URI
const allParamNames = {
  POST: {
    signup: ['email', 'username', 'password'],
    login: ['email', 'password'],
    updateRelationshipStatus: ['userId', 'authToken', 'relationshipStatus'],
    setUsername: ['userId', 'authToken', 'username'],
    updateWeeklyNum: ['userId', 'authToken', 'weeklyNum'],
    updateMode: ['userId', 'authToken', 'isTraining'],
    finishInitial: ['userId', 'authToken', 'finishDate'],
    addExpLearning: ['userId', 'authToken', 'behaviorId', 'exp'],
    updateStreak: ['userId', 'authToken'],
    addExp: ['userId', 'authToken', 'questionId', 'exp'],
    chooseBehaviors: ['userId', 'authToken', 'behaviorIds'],
    setAssessDay: ['userId', 'authToken', 'assessDay'],
    setAssessDate: ['userId', 'authToken', 'dateFinished'],
    writeEntry: ['userId', 'authToken', 'entryDate', 'entry', 'entryRating'],
    report: ['userId', 'authToken', 'report'],
    pair: ['userId', 'authToken', 'userIdPair'],
    unpair: ['userId', 'authToken'],
    createPairRequest: ['userId', 'authToken', 'receiverEmail'],
    completedBehavior: ['userId', 'authToken', 'behaviorId'],
  },
  GET: {
    relationshipStatus: ['userId', 'authToken'],
    username: ['userId', 'authToken'],
    getMode: ['userId', 'authToken'],
    totalExp: ['userId', 'authToken'],
    initial: ['userId', 'authToken'],
    finishedInitial: ['userId', 'authToken'],
    learningQuestions: ['userId', 'authToken', 'behaviorId'],
    recommendedArea: ['userId', 'authToken'],
    usageQuestions: ['userId', 'authToken', 'behaviorId'],
    suggestedBehaviors: ['userId', 'authToken', 'areaId'],
    nextAssessDate: ['userId', 'authToken'],
    currentBehaviors: ['userId', 'authToken'],
    areaLevel: ['userId', 'authToken', 'areaId'],
    streak: ['userId', 'authToken', 'currentDate'],
    getPastWeeks: ['userId', 'authToken'],
    allAreas: ['userId', 'authToken'],
    allBehaviors: ['userId', 'authToken', 'areaId'],
    area: ['userId', 'authToken', 'areaId'],
    behavior: ['userId', 'authToken', 'behaviorId'],
    relatedBehaviors: ['userId', 'authToken', 'behaviorId'],
    behaviorImage: ['userId', 'authToken', 'behaviorId'],
    monthEntries: ['userId', 'authToken', 'month', 'year'],
    entry: ['userId', 'authToken', 'entryDate'],
    getRelationship: ['userId', 'authToken'],
    pairRequests: ['userId', 'authToken'],
    search: ['userId', 'authToken', 'query'],
  },
};

export async function _getAuthTokenUserId(){
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    const userId = await AsyncStorage.getItem('userId');
    console.log("authToken:" + authToken);
    return { authToken, userId };
  } catch(error) {
    console.error("Error getting authToken and userId: ", error);
  }
}

// used to fetch from the server
// params:
//   requestType: 'POST' or 'GET'
//   requestName: name of the request
//   extraParams: object with params other than authToken and userId
// returns a promise that resolves with the result of parsing the response as JSON or text
export default async function fetch(requestType, requestName, extraParams = {}) {
  const {
    authToken,
    userId,
  } = await _getAuthTokenUserId();

  const params = {
    ...extraParams,
    authToken,
    userId,
  };

  invariant(['POST', 'GET'].includes(requestType),
    `Invalid type of request '${requestType}'. Must be 'POST' or 'GET'.`);
  invariant(allParamNames[requestType].hasOwnProperty(requestName),
    `Invalid name of ${requestType} request '${requestName}'.`);

  const paramNames = allParamNames[requestType][requestName];
  paramNames.forEach((paramName) => {
    invariant(params.hasOwnProperty(paramName),
      `Missing param '${paramName}' for ${requestType} request ${requestName}.`);
  });

  let path = `http://${host}:3000/${requestName}`;

  if (requestType === 'GET') {
    paramNames.forEach((paramName) => {
      path += '/' + params[paramName];
    });
  }

  return isomorphicFetchRetry(path, {
    method: requestType,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...requestType === 'POST' && { body: JSON.stringify(params) },
  }).then((response) => response.text())
    .then((text) => {
      let responseJson;
      try {
        // check if response is JSON
        responseJson = JSON.parse(text);
      } catch(err) {
        // nope, response is text
        return text;
      }
      // okay, response is JSON
      invariant(!responseJson.hasOwnProperty('errno'),
        `Server returned response with errno ${responseJson.errno} for ${requestType} request ${requestName}`);
      return responseJson;
    })
    .catch((error) => {
      console.error(`${requestType} request ${requestName} failed: `, error);
    });
}
