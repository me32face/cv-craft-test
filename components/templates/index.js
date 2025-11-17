// components/templates/index.js

import Template30 from "./Template30";
import Template31 from "./Template31";

export const templates = {
  template30: Template30,
  template31: Template31,
};

export const templateInputs = {
  template1: {
    name: true,
    title: true,
    about: true,
    profileImage: false,
    skills: true,
  },

  template30: {
    name: true,
    title: true,
    profileImage: true,
    phone: true,
    email: true,
    address: true,
    skills: true,
    languages: true,
    Summary: true,
    experiences: true,
    education: true,
    certificates: true,
  },

  template31: {
    name: true,
    title: true,
    about: true,
    profileImage: true,
    experience: true,
    education: true,
    skills: true,
  },
};
