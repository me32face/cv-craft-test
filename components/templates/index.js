// components/templates/index.js

import Template30 from "./Template30";
import Template31 from "./Template31";
import Template32 from "./Template32";

export const templates = {
  template30: Template30,
  template31: Template31,
  template32: Template32
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

  template32: {
    name: true,
    title: true,
    profileImage: true,
    phone: true,
    email: true,
    address: true,
    languages: true,
    experiences: true,
    education: true,
    certificates: true,
  },

};
