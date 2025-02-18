from django.db import models
from edge.models import Genome


class Operation(models.Model):
    class Meta:
        app_label = "edge"

    # numerical values are stored in database, do not change unless you have a
    # plan for migrating data.

    RECOMBINATION = (1, "Homologous Recombination")
    CRISPR_DSB = (2, "CRISPR-Cas9 WT (Double Stranded Break)")
    SSR = (4, "Site Specific Recombinase")

    genome = models.ForeignKey(Genome, on_delete=models.CASCADE)
    type = models.IntegerField(
        choices=(RECOMBINATION, CRISPR_DSB, SSR)
    )
    params = models.TextField(null=True, blank=True)
