import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { AgGridModule } from 'ag-grid-angular';
import { OncologyReportsComponent } from
'./oncology-reports.component';
import { OncologyReportService } from '../../../etl-api/oncology-reports.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

const getOncologyReportsService =
jasmine.createSpyObj('OncologyReportService', ['getOncologyReports', 'getSpecificOncologyReport']);

let mockReportsResponse: any = [
    {
        'program': 'Test program 1',
        'uuid': 'uuid1',
        'reports': [
            {
                'name': 'B1. Test report 1',
                'type': 'test-1-screening-numbers',
                'description': 'Test report 1 description'
            }]
          },
        {
                'program': 'Test Program 2',
                'uuid': 'uuid2',
                'reports': [
                    {
                        'name': 'C1. Cervical screening numbers',
                        'type': 'test-2-screening-numbers',
                        'description': 'Test report2 descriprion'
                    }
                ]
        }
];

// Make the spy return a synchronous Observable with the test data
const getReportsSpy = getOncologyReportsService.getOncologyReports
.and.returnValue(Observable.of(mockReportsResponse) );

const mockParams = {};

class MockRouter {
    public navigate = jasmine.createSpy('navigate');
   }

const mockActivatedRoute = {
  queryParams: {
    subscribe: jasmine.createSpy('subscribe')
      .and
      .returnValue(Observable.of(mockParams))
  }
};

describe('Component: Oncology Reports', () => {
  let fixture: ComponentFixture<OncologyReportsComponent>;
  let cd: ChangeDetectorRef;
  let comp: any;
  let route: Router;
  let router: ActivatedRoute;
  let oncologyReportService: OncologyReportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        AgGridModule.withComponents([])
      ],
      declarations: [
        OncologyReportsComponent
      ],
      providers: [
        { provide: OncologyReportService, useValue: getOncologyReportsService },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OncologyReportsComponent);
        comp = fixture.componentInstance;
        oncologyReportService = fixture.debugElement.injector
        .get(OncologyReportService);
        route = fixture.debugElement.injector.get(Router);
        router = fixture.debugElement.injector.get(ActivatedRoute);

      });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
  });

  it('should get oncology reports after component initialized', fakeAsync(() => {
    fixture.detectChanges(); // onInit()
    expect(getReportsSpy.calls.any()).toBe(true, 'getReports called');
    expect(comp.oncologyReports).toBe(mockReportsResponse);
  }));

});
