---
layout: default
---

<div class="page-header">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div class="page-section">
                    <h1 class="page-title ">About Us</h1>
                    <div class="page-breadcrumb">
                        WRENCH is open-source software distributed under the <strong style="color: #999">LGPLv3 license</strong>.
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 hidden-xs">
                <div class="page-section">
                    <p>
                        WRENCH is developed by a collaborative team from the <a href="https://manoa.hawaii.edu" 
                        target="_blank">University of Hawai'i at Mãnoa</a> (UHM), <a href="https://usc.edu" target="_blank">
                        University of Southern California</a> (USC), and the <a href="https://cnrs.fr" target="_blank">
                        National Center for Scientific Research</a> (CNRS). 
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="space-medium">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="section-title">
                    <h1>Our Team</h1>
                </div>
            </div>
        </div>
        <div class="row">
        {% if site.data.team_current.size > 0 %}
        {% for n in site.data.team_current %}
            <div class="col-sm-2 col-xs-6">
                <div class="team-single-wrapper">
                    <div class="team-single">
                        <div class="person-thumb">
                            <img src="images/aboutus/{{ n.photo }}" class="img-responsive" alt="">
                        </div>
                        <div class="social-profile">
                            <ul class="nav nav-pills">
                                <li><a href="mailto:{{ n.email }}"><i class="fa fa-envelope"></i></a>
                                </li>
                                <li><a href="{{ n.linkedin }}" target="_blank"><i
                                        class="fab fa-linkedin"></i></a></li>
                                <li><a href="{{ n.website }}" target="_blank"><i
                                        class="fa fa-link"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="person-info">
                        <h3>{{ n.name }}</h3>
                        <div class="role">{{ n.role }}</div>
                        <p>{{ n.description }}</p>
                    </div>
                </div>
            </div>
        {% endfor %}
        {% endif %}
        </div>
    </div>
</div>

<div class="space-medium">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="section-title">
                    <h1>Previous Contributors</h1>
                </div>
            </div>
        </div>
        <div class="row">
        {% if site.data.team_previous.size > 0 %}
        {% for n in site.data.team_previous %}
            <div class="col-sm-2 col-xs-6">
                <div class="team-single-wrapper">
                    <div class="team-single">
                        <div class="person-thumb">
                            <img src="images/aboutus/{{ n.photo }}" class="img-responsive" alt="">
                        </div>
                        <div class="social-profile">
                            <ul class="nav nav-pills">
                                <li><a href="{{ n.linkedin }}" 
                                    target="_blank"><i class="fab fa-linkedin"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="person-info">
                        <h3>{{ n.name }}</h3>
                        <div class="role">{{ n.role }}</div>
                        <p>{{ n.description }}</p>
                    </div>
                </div>
            </div>
        {% endfor %}
        {% endif %}
        </div>
    </div>
</div>
