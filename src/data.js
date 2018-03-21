export default [
    {
        "name": "Organizations",
        "values": [{
                "id": "102jvbyv8efwy",
                "category": "Mobility information provider",
                "name": "WunderCar Mobility Solutions GmbH",
                "abbreviation": "Wunder",
                "type":"organization"
            },
            {
                "id": "10g6c72mp5cq9",
                "category": "Mobility service provider",
                "name": "Car systems Scheil GmbH & Co. KG.",
                "abbreviation": "car systems Scheil",
                "type":"organization"
            },
            {
                "id": "6z0w71hmmovm",
                "category": "Parts supplier",
                "name": "Robert Bosch GmbH",
                "abbreviation": "Bosch",
                "type":"organization"
            },
            {
                "id": "opbn94w1g052",
                "category": "Mobility service provider",
                "name": "Hubject Gmbh",
                "abbreviation": "Hubject",
                "type":"organization"
            },
            {
                "id": "qig0ghlmgcb8",
                "category": "Energy supplier",
                "name": "EnBW Energie Baden-Württemberg AG",
                "abbreviation": "EnBW",
                "type":"organization"
            },
            {
                "id": "t2ith4r96ury",
                "category": "Technology company",
                "name": "Siemens AG",
                "abbreviation": "Siemens",
                "type":"organization"
            },
            {
                "id": "bodzqt0unjrg",
                "category": "Service provider",
                "name": "Klotter Elektrotechnik GmbH",
                "abbreviation": "Klotter",
                "type":"organization"
            },
            {
                "id": "1hhoclgtpf4lh",
                "category": "Manufacturer",
                "name": "BMW AG",
                "abbreviation": "BMW",
                "type":"organization"
            }
        ]
    },
    {
        "name" : "O2O",
        "values":[
            {
                "id": "1quryf2l0ysip",
                "category": "Cooperation",
                "source": {
                    "id": "10g6c72mp5cq9",
                    "name": "Car systems Scheil GmbH & Co. KG.",
                    "abbreviation": "car systems Scheil"
                },
                "target": {
                    "id": "6z0w71hmmovm",
                    "name": "Robert Bosch GmbH",
                    "abbreviation": "Bosch"
                }
            },
            {
                "id": "3s0vwcxnm9ps",
                "category": "Founded",
                "source": {
                    "id": "6z0w71hmmovm",
                    "name": "Robert Bosch GmbH",
                    "abbreviation": "Bosch"
                },
                "target": {
                    "id": "opbn94w1g052",
                    "name": "Hubject Gmbh",
                    "abbreviation": "Hubject"
                }
            },
            {
                "id": "c61jwk9uyqja",
                "category": "Partially owns",
                "source": {
                    "id": "6z0w71hmmovm",
                    "name": "Robert Bosch GmbH",
                    "abbreviation": "Bosch"
                },
                "target": {
                    "id": "opbn94w1g052",
                    "name": "Hubject Gmbh",
                    "abbreviation": "Hubject"
                }
            },
            {
                "id": "10qiszfzzojyk",
                "category": "Partially owns",
                "source": {
                    "id": "qig0ghlmgcb8",
                    "name": "EnBW Energie Baden-Württemberg AG",
                    "abbreviation": "EnBW"
                },
                "target": {
                    "id": "opbn94w1g052",
                    "name": "Hubject Gmbh",
                    "abbreviation": "Hubject"
                }
            },
            {
                "id": "17fkzwzc1whgc",
                "category": "Founded",
                "source": {
                    "id": "t2ith4r96ury",
                    "name": "Siemens AG",
                    "abbreviation": "Siemens"
                },
                "target": {
                    "id": "opbn94w1g052",
                    "name": "Hubject Gmbh",
                    "abbreviation": "Hubject"
                }
            },
            {
                "id": "ztb2n41hkauh",
                "category": "Supplied by",
                "source": {
                    "id": "qig0ghlmgcb8",
                    "name": "EnBW Energie Baden-Württemberg AG",
                    "abbreviation": "EnBW"
                },
                "target": {
                    "id": "bodzqt0unjrg",
                    "name": "Klotter Elektrotechnik GmbH",
                    "abbreviation": "Klotter"
                }
            },
            {
                "id": "13abosh8wpi5n",
                "category": "Supplied by",
                "source": {
                    "id": "1hhoclgtpf4lh",
                    "name": "BMW AG",
                    "abbreviation": "BMW"
                },
                "target": {
                    "id": "t2ith4r96ury",
                    "name": "Siemens AG",
                    "abbreviation": "Siemens"
                }
            },
            {
                "id": "18xpw0qcfmlbb",
                "category": "Founded",
                "source": {
                    "id": "1hhoclgtpf4lh",
                    "name": "BMW AG",
                    "abbreviation": "BMW"
                },
                "target": {
                    "id": "opbn94w1g052",
                    "name": "Hubject Gmbh",
                    "abbreviation": "Hubject"
                }
            }

        ]
    },
    {
      "name":"Projects",
      "values":[
        {
          "id" : "1",
          "name" : "Green Solutions",
          "abbreviation":"Green",
          "color":"Blue",
          "type":"project",
          "cities":[
            {
              "id":"111",
              "name":"München"
            },
            {
              "id":"112",
              "name":"Hamburg"
            }
          ]
        },
        {
          "id" : "2",
          "name" : "Smart Cities",
          "abbreviation":"Smart",
          "color":"Yellow",
          "type":"project",
          "cities":[
            {
              "id":"111",
              "name":"München"
            },
            {
              "id":"113",
              "name":"Berlin"
            }
          ]
        }
      ]
    },
    {
      "name" : "O2P",
      "values":[
            {
                "id": "11",
                "source": {
                    "id": "6z0w71hmmovm",
                    "name": "Robert Bosch GmbH",
                    "abbreviation": "Bosch"
                },
                "target": {
                    "id" : "2",
                    "name" : "Smart Cities",
                    "abbreviation":"Smart"
                }
            },
            {
                "id" : "12",
                "source": {
                    "id": "10g6c72mp5cq9",
                    "name": "Car systems Scheil GmbH & Co. KG.",
                    "abbreviation": "car systems Scheil"
                },
                "target": {
                    "id" : "2",
                    "name" : "Smart Cities",
                    "abbreviation":"Smart"
                }
            },
            {
                "id" : "13",
                "source": {
                    "id": "1hhoclgtpf4lh",
                    "name": "BMW AG",
                    "abbreviation": "BMW"
                },
                "target": {
                  "id" : "1",
                  "name" : "Green Solutions",
                  "abbreviation":"Green"
                }
            },
            {
                "id" : "14",
                "source": {
                    "id": "t2ith4r96ury",
                    "name": "Siemens AG",
                    "abbreviation": "Siemens"
                },
                "target": {
                  "id" : "1",
                  "name" : "Green Solutions",
                  "abbreviation":"Green"
                }
            }
          
        ]
    },
    {
        "name":"city",
        "values" : [
          {
            "id":"111",
            "name":"München",
            "type":"city"
          },
          {
            "id":"112",
            "name":"Hamburg",
            "type":"city"
          },
          {
            "id":"113",
            "name":"Berlin",
            "type":"city"
          }
          ]
      }
]
