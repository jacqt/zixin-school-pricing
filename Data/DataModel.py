'''
Represents a data model to calculate fees
'''

import StringIO
import csv
import json

class School:
    def __init__(self, csv_string):
        '''
        Receives a single line of csv and returns the school object
        '''
        csv_file = StringIO.StringIO(csv_string)
        csv_reader = csv.reader(csv_file, delimiter = ',')
        for row in csv_reader:
            csv_parsed = row 
            break
        self.region                 = csv_parsed[0]
        self.district               = csv_parsed[1]
        self.number                 = int(csv_parsed[2])
        self.name                   = csv_parsed[3]
        self.price_by_years         = self.getPrices(csv_parsed[4:10])
        self.discount_boundaries    = self.getDiscounts(csv_parsed[11:20])
        print self.discount_boundaries

    def serializeToJson(self):
        return json.dumps(self.getSerializeableObject())

    def getSerializeableObject(self):
        jsonObj = {}
        jsonObj['region']               = self.region
        jsonObj['region']               = self.region             
        jsonObj['district']             = self.district           
        jsonObj['number']               = self.number             
        jsonObj['name']                 = self.name               
        jsonObj['price_by_years']       = self.price_by_years     
        jsonObj['discount_boundaries']  = self.discount_boundaries
        return jsonObj

    def getPrices(self, prices_list):
        print "Prices received: ", prices_list
        prices_list = map(lambda p:  int(p), prices_list)
        prices = {}
        prices["year_1_price"] = prices_list[0]
        prices["year_2_price"] = prices_list[1]
        prices["year_3_price"] = prices_list[2]
        prices["year_4_price"] = prices_list[3]
        prices["year_5_price"] = prices_list[4]
        prices["year_6_price"] = prices_list[5]
        return prices

    def getDiscounts(self, discounts_list):
        print "Discount received: ", discounts_list
        discounts_list = map(lambda p:  int(p), discounts_list)
        discount_boundaries = {}
        #First transform -1 to the value preceding it
        discount_boundaries["hundred_per_boundary"] = discounts_list[0]
        discount_boundaries["eighty_perc_boundary"] = discounts_list[1]
        discount_boundaries["seventyfive_perc_boundary"] = discounts_list[2]
        discount_boundaries["sixty_perc_boundary"] = discounts_list[3]
        discount_boundaries["fifty_perc_boundary"] = discounts_list[4]
        discount_boundaries["forty_perc_boundary"] = discounts_list[5]
        discount_boundaries["thirtythree_perc_boundary"] = discounts_list[6]
        discount_boundaries["twentyfive_perc_boundary"] = discounts_list[7]
        discount_boundaries["twenty_perc_boundary"] = discounts_list[8]
        return discount_boundaries

