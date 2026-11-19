import React from 'react';
import {registerRoot} from 'remotion';
import {ExperimentComposition} from './experiment';
import {ShowcaseComposition} from './showcase';

registerRoot(() => <><ExperimentComposition/><ShowcaseComposition/></>);
